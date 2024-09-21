const OFFSET_wk_vtable_first_element     = 0xDEADC0DE;
const OFFSET_wk_memset_import            = 0xDEADC0DE;
const OFFSET_wk___stack_chk_guard_import = 0xDEADC0DE;

const OFFSET_lk___stack_chk_guard        = 0xDEADC0DE;
const OFFSET_lk_pthread_create_name_np   = 0xDEADC0DE;
const OFFSET_lk_pthread_join             = 0xDEADC0DE;
const OFFSET_lk_pthread_exit             = 0xDEADC0DE;
const OFFSET_lk__thread_list             = 0xDEADC0DE;
const OFFSET_lk_sleep                    = 0xDEADC0DE;
const OFFSET_lk_sceKernelGetCurrentCpu   = 0xDEADC0DE;

const OFFSET_lc_memset                   = 0xDEADC0DE;
const OFFSET_lc_setjmp                   = 0xDEADC0DE;
const OFFSET_lc_longjmp                  = 0xDEADC0DE;

const OFFSET_WORKER_STACK_OFFSET         = 0xDEADC0DE;

let wk_gadgetmap = {
	"ret":              0xDEADC0DE,
	"pop rdi":          0xDEADC0DE,
	"pop rsi":          0xDEADC0DE,
	"pop rdx":          0xDEADC0DE,
	"pop rcx":          0xDEADC0DE,
	"pop r8":           0xDEADC0DE,
	"pop r9":           0xDEADC0DE,
	"pop rax":          0xDEADC0DE,
	"pop rsp":          0xDEADC0DE,

	"mov [rdi], rsi":   0xDEADC0DE,
	"mov [rdi], rax":   0xDEADC0DE,
	"mov [rdi], eax":   0xDEADC0DE,

	"infloop":          0xDEADC0DE,

    //branching specific gadgets
	"cmp [rcx], eax":   0xDEADC0DE,
	"sete al":          0xDEADC0DE,
	"seta al":          0xDEADC0DE,
	"setb al":          0xDEADC0DE,
	"setg al":          0xDEADC0DE,
	"setl al":          0xDEADC0DE,
	"shl rax, 3":       0xDEADC0DE,
	"add rax, rdx":     0xDEADC0DE,
	"mov rax, [rax]":   0xDEADC0DE,
	"inc dword [rax]":  0xDEADC0DE,
};

// TODO
let syscall_map = {
	
};

// Kernel stack offsets
const OFFSET_KERNEL_STACK_COOKIE                = 0x0000970;
const OFFSET_KERNEL_STACK_SYS_SCHED_YIELD_RET   = 0x0000848; // is this right?

// Kernel text-relative offsets
const OFFSET_KERNEL_DATA                        = 0x1B80000;
const OFFSET_KERNEL_SYS_SCHED_YIELD_RET         = 0x0533B12;
const OFFSET_KERNEL_ALLPROC                     = 0x4281C28;
const OFFSET_KERNEL_SECURITY_FLAGS              = 0x7F61274;
const OFFSET_KERNEL_TARGETID                    = 0x7F6127D;
const OFFSET_KERNEL_QA_FLAGS                    = 0x7F61298;
const OFFSET_KERNEL_UTOKEN_FLAGS                = 0x7F61300;
const OFFSET_KERNEL_PRISON0                     = 0x34CBD20;
const OFFSET_KERNEL_ROOTVNODE                   = 0x82934C0;
