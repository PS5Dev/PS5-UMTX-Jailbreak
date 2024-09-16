const payload_map =
    [
        {
            displayTitle: 'etaHEN',
            description: 'All-in-one HEN',
            fileName: 'etaHEN-1.7B.bin',
            author: 'LightningMods_, sleirsgoevy, ChendoChap, astrelsky, illusion',
            source: 'https://github.com/LightningMods/etaHEN',
            version: '1.7 beta'
        },
        {
            displayTitle: 'K-Stuff',
            description: 'FPKG enabler',
            fileName: 'ps5-kstuff-v1.4.bin',
            author: 'sleirsgoevy',
            source: 'https://github.com/idlesauce/ps5-kstuff-builds/releases',
            version: '1.4'
        },
        {
            displayTitle: 'libhijacker game-patch',
            description: 'Patches supported games to run at higher framerates, and adds debug menus to certain titles.',
            fileName: 'libhijacker-1.160.elf',
            author: 'illusion0001, astrelsky',
            source: 'https://github.com/illusion0001/libhijacker/releases',
            version: '1.160'
        },
        {
            displayTitle: 'ps5debug',
            description: 'Debugger (Experimental beta)',
            fileName: 'ps5debug.elf',
            author: 'SiSTR0, ctn123',
            source: 'https://github.com/GoldHEN/ps5debug',
            version: '1.0b1'
        },
        {
            displayTitle: 'HEN-V',
            description: 'PS5 Homebrew Enabler, FTP, klog',
            fileName: 'henv.elf',
            author: 'astrelsky',
            source:'https://github.com/astrelsky/HEN-V/releases',
            version: '0.0.2-alpha'
        },
        {
            displayTitle: 'PS5 Payload ELF Loader',
            description: 'Uses port 9021. Persistent network elf loader',
            fileName: 'elfldr.elf',
            author: 'john-tornblom',
            source:'https://github.com/ps5-payload-dev/elfldr/releases',
            version: '0.14'
        },
        {
            displayTitle: 'websrv',
            description: "Uses john-tornblom's elfldr. Custom homebrew loader. Runs on port 8080.",
            fileName: 'websrv.elf',
            author: 'john-tornblom',
            loader: 'john-tornblom-elfldr',
            source:'https://github.com/ps5-payload-dev/websrv/releases',
            version: '0.8'
        },
        {
            displayTitle: 'shsrv',
            description: "Uses john-tornblom's elfldr. Telnet shell server. Runs on port 2323.",
            fileName: 'shsrv.elf',
            author: 'john-tornblom',
            loader: 'john-tornblom-elfldr',
            source:'https://github.com/ps5-payload-dev/shsrv/releases',
            version: '0.9'
        },
        {
            displayTitle: 'ftpsrv',
            description: "Uses john-tornblom's elfldr. FTP server. Runs on port 2121.",
            fileName: 'ftpsrv.elf',
            author: 'john-tornblom',
            loader: 'john-tornblom-elfldr',
            source:'https://github.com/ps5-payload-dev/ftpsrv/releases',
            version: '0.9'
        },
        {
            displayTitle: 'klogsrv',
            description: "Uses john-tornblom's elfldr. Klog server. Runs on port 3232.",
            fileName: 'klogsrv.elf',
            author: 'john-tornblom',
            loader: 'john-tornblom-elfldr',
            source:'https://github.com/ps5-payload-dev/klogsrv/releases',
            version: '0.4'
        },
        {
            displayTitle: 'gdbsrv',
            description: "Uses john-tornblom's elfldr. GDB server. Runs on port 2159.",
            fileName: 'gdbsrv.elf',
            author: 'john-tornblom',
            loader: 'john-tornblom-elfldr',
            source:'https://github.com/ps5-payload-dev/gdbsrv/releases',
            version: '0.3'
        },
        {
            displayTitle: 'FTPS5 (Non-Persistent)',
            description: 'FTP Server',
            fileName: 'ftps5-np.elf',
            author: 'SiSTR0, zecoxao, EchoStretch',
            source:'https://github.com/EchoStretch/FTPS5/releases',
            version: '1.4'
        },
        {
            displayTitle: 'FTPS5 (Persistent)',
            description: 'FTP Server, causes kernel panic on shutdown.',
            fileName: 'ftps5-p.elf',
            author: 'SiSTR0, zecoxao, EchoStretch',
            source:'https://github.com/EchoStretch/FTPS5/releases',
            version: '1.4'
        },
        {
            displayTitle: 'Versions',
            description: 'Shows kernel build, os and sdk versions',
            fileName: 'versions.elf',
            author: 'SiSTRo',
            source:'https://github.com/SiSTR0/ps5-versions/releases/download/v1.0/ps5-versions.elf',
            version: '1.0'
        },
        {
            displayTitle: 'GetOSVersion',
            description: 'very slow',
            fileName: 'getOsVersion.elf',
            author: 'logic-68',
            source:'https://github.com/logic-68/getOsVersion/releases',
            version: '1.0.2'
        },
        {
            displayTitle: 'PS5_Browser_appCache_remove',
            description: 'Removes appcache from browser.',
            fileName: 'Browser_appCache_remove.elf',
            author: 'Storm21CH',
            source:'https://github.com/Storm21CH/PS5_Browser_appCache_remove/blob/main/Browser_appCache_remove.elf',
            version: '1.0fix'
        }

    ];
