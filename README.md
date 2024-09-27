# PS5 UMTX Jailbreak
---
## Summary
This repo contains a WebKit ROP exploit of the [UMTX race use-after-free (CVE-2024-43102) vulnerability](https://www.freebsd.org/security/advisories/FreeBSD-SA-24:14.umtx.asc) reported by Synacktiv. It's basically a port of [fail0verflow's](https://github.com/fail0verflow/ps5-umtxdbg/) and [flatz'](https://gist.github.com/flatz/89dfe9ed662076742f770f92e95e12a7) exploit strategy. It abuses the UAF to get a read/write mapping into a kernel thread stack, and leverages pipe reads and writes to establish a (not quite ideal) arbitrary read/write primitive in the kernel. This read/write is then escalated to a better one that leverages an ipv6 socket pair and pipe pair for stable read/write that can be passed to payloads in the same manner that was possible with the previous [IPV6 PS5 kernel exploit](https://github.com/Cryptogenic/PS5-IPV6-Kernel-Exploit).

The page itself is a stripped down and modified version of [idlesauce's PS5 Exploit Host](https://github.com/idlesauce/PS5-Exploit-Host) as it already did the work of gluing psfree to my previously used code style. This host is also my personal choice for running things as it's very smooth and integrates useful payloads, hopefully it is updated to support this exploit in the near future <3.

Ultimately a payload loader will be launched to listen for payload ELFs on port 9021. I recommend the [PS5 Payload Dev SDK](https://github.com/ps5-payload-dev/sdk/) as it should have full compatibility with this loader when kernel offsets are added.

This vulnerability impacts 1.00 firmware to 7.61 firmware, however FW >= 3.00 seem to have additional mitigations that require tweaking of the exploit to work. ~~As I'm mostly only interested in lower firmwares, this exploit doesn't support FW >= 3.00 as of yet.~~ Furthermore, the WebKit vulnerability that we chain with was patched in 6.00, so another WebKit exploit that achieves userland read/write will be required for these systems. Again, as I'm not focused on higher firmwares, this is left uncompleted right now.

**Important Notes**
- 3.00+ has lower reliability and may take longer to execute, if you're stuck at "triggering race" for a while, close browser and retry.
- 5.00+ the ELF loader currently doesn't work, because we can no longer properly invoke dlsym, payload SDK needs changes.

The following firmwares are currently supported:
- 1.00
- 1.02
- 1.05
- 1.10
- 1.11
- 1.12
- 1.13
- 1.14
- 2.00
- 2.20
- 2.25
- 2.26
- 2.30
- 2.50
- 2.70
- 3.00
- 3.20
- 4.00
- 4.02
- 4.03
- 4.50
- 4.51
- 5.00
- 5.02
- 5.10
- 5.50

## Currently included
- Obtains arbitrary kernel read/write
- Enables debug settings menu (note: you will have to fully exit settings and go back in to see it).
- Gets root privileges and breaks out of sandbox/jail.
- Runs John Tornblom's ELF loader on port 9021 for payloads to execute (on < 5.00FW)

## Limitations
- This exploit achieves read/write, **but not code execution**. This is because we cannot currently dump kernel code for gadgets, as kernel .text pages are marked as eXecute Only Memory (XOM). Attempting to read kernel .text pointers will panic!
- As per the above + the hypervisor (HV) enforcing kernel write protection, this exploit also **cannot install any patches or hooks into kernel space**.
- Clang-based fine-grained Control Flow Integrity (CFI) is present and enforced.
- Supervisor Mode Access Prevention/Execution (SMAP/SMEP) cannot be disabled, due to the HV.
- FW >= 6.00 requires new WebKit exploit and is thus not supported.

## How to use
1. Configure fakedns via `dns.conf` to point `manuals.playstation.net` to your PCs IP address
2. Run fake dns: `python fakedns.py -c dns.conf`
3. Run HTTPS server: `python host.py`
4. Go into PS5 advanced network settings and set primary DNS to your PCs IP address and leave secondary at `0.0.0.0`
   1. Sometimes the manual still won't load and a restart is needed, unsure why it's really weird
5. Go to user manual in settings and accept untrusted certificate prompt, run
6. Optional: Uncomment kernel .data dump code and run dump server script (note: address/port must be substituted in exploit.js).

## Future work
- [X] ~~Update exploit strat for FW >= 3.xx to account for mitigations~~
- [X] ~~Add offsets for more (lower) firmwares~~
- [ ] Add WebKit exploit for FW >= 6.00.

## Using ELF Loader
To use the ELF loader, run the exploit until completion. Upon completion it'll run a server on port `:9021`. Connect and send your ELF to the PS5 over TCP and it'll run it. This loader should continue to accept and execute payloads even after exiting the browser.

## Exploit strategy notes
**Initial double free**

The strategy for this exploit largely comes from fail0verflow and flatz. See [chris@accessvector's writeup](https://accessvector.net/2024/freebsd-umtx-privesc) for more information on the vulnerability. Upon exploiting, it essentially gives us a double free. We can use this to overlap the `vmobject` of a kernel stack with that of an `mmap` mapping to get a window into a kernel thread's stack. This very powerful capability lets us read/write to arbitrary kernel pointers on the stack, giving ASLR defeat and the ability to create primitives. The thread which we have access to it's stack we'll call the victim thread.

**Getting arbitrary read/write**

By creating a pipe and filling up the pipe buffer on the main thread, then trying to write to it using the victim thread, the victim thread will block waiting for space to clear up in the buffer. During this time, we can use our window into the kernel stack to change the `iovec` pointers to kernel pointers and set flags to get them treated as kernel addresses. By then reading the pipe on the main thread, we can get kernel arbitrary read.

Similarly, by getting the victim thread to read on the pipe, it will block waiting for incoming data. We can then, again, overwrite the `iovec` pointers and make them kernel pointers, and write data on the main thread to get kernel arbitrary write.

**Upgrading arbitrary read/write**

By this stage, we have an arbitrary read/write with no real constraints, but we're tied to using multithreading and blocking for it to work which isn't ideal. We then use the R/W to iterate the process' FD table and overlap the `pktopts` of two IPV6 sockets. We can then create another arbitrary read/write via the `IPV6_PKTINFO` sockopt. This read/write primitive again isn't ideal though as it's constrained in size and contents due to the underlying socket option. We keep this step mostly to emulate the scenario of the IPV6 exploit, which most payloads and such were built on.

We can get a better read/write via pipes. By again iterating the process' FD table and modifying pipemap buffer objects, we can establish read/write. The IPV6 socket pair is used as a mechanism to control the pipemap buffer.

**Fixing/side-stepping corruption**

If we leave things as is and attempt to close the browser, the system will crash. This is because the process cleanup will try to free the kernel stack which has already been free'd. To avoid this, we do two things:

1. Intentionally leak the refcount on the shm FD we use for the initial double free so that it isn't free'd upon process exit
2. Zero the victim thread's `td_kstack` in the process' thread list.

## Stability notes
On FW < 3.00, this exploit is very stable. The only critical point of failure is failing to overlap the `vmobjects`. On higher firmwares, this overlap is harder to achieve due to alleged mitigations at the page/heap allocator level.

## Credits / Shouts
- [fail0verflow](https://fail0verflow.com/blog/)
- [flatz](https://x.com/flat_z)
- [ChendoChap](https://github.com/ChendoChap)
- SlidyBat
- abc/psfree
- [idlesauce](https://github.com/idlesauce)
- [Znullptr](https://twitter.com/Znullptr)
- [zecoxao](https://twitter.com/notnotzecoxao)
- [SocracticBliss](https://twitter.com/SocraticBliss)
- [John Tornblom](https://github.com/john-tornblom)

## Discord
Those interested in contributing to PS5 research/dev can join a discord I have setup [here](https://discord.gg/kbrzGuH3F6).
