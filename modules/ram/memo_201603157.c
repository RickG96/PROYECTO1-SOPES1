#include <linux/module.h>
//Header para usar KERN_INFO
#include <linux/kernel.h>

//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>	
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

#include <linux/sys.h>

#include <linux/sysinfo.h>

#include <linux/sched.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/mm.h>

static int device_open(struct inode * , struct file * );
static int device_release(struct inode * , struct file * );
static ssize_t device_read(struct file * , char * , size_t, loff_t * );
static ssize_t device_write(struct file * ,
  const char * , size_t, loff_t * );
  

MODULE_LICENSE("GPL");
MODULE_AUTHOR("RUNI");
MODULE_DESCRIPTION("Modulo de memoria ram");
MODULE_VERSION("1.0");

static char *str = NULL;


static int my_proc_show(struct seq_file *archivo,void *v){
	
    //const unsigned long megabyte = 1024 * 1024;
    
    struct sysinfo si;
    si_meminfo (&si);
    //unsigned long totalDeRam = si.totalram;
    //unsigned long ramLibre = si.freeram;
    int number = 10;

    seq_printf(archivo, "[\n");
    seq_printf(archivo, "    {\n");
    seq_printf(archivo, "        \"total_ram\": %lu,\n", si.totalram * 4 / 1024);
    seq_printf(archivo, "        \"free_ram\": %lu,\n", si.freeram * 4 / 1024);
    seq_printf(archivo, "        \"usage_ram\": %lu,\n", (si.totalram - si.freeram) * 4 / 1024);
    seq_printf(archivo, "        \"usage_percentage\": %lu\n", ((si.totalram - si.freeram) * 100) / si.totalram);
    seq_printf(archivo, "    }\n");
    seq_printf(archivo, "]\n");

	return 0;
}

static ssize_t my_proc_write(struct file* file,const char __user *buffer,size_t count,loff_t *f_pos){
	char *tmp = kzalloc((count+1),GFP_KERNEL);
	if(!tmp)return -ENOMEM;
	if(copy_from_user(tmp,buffer,count)){
		kfree(tmp);
		return EFAULT;
	}
	kfree(str);
	str=tmp;
	return count;
}

static int my_proc_open(struct inode *inode,struct file *file){
	return single_open(file,my_proc_show,NULL);
}


static struct file_operations operaciones =
{
	.owner = THIS_MODULE,
	.open = my_proc_open,
	.release = single_release,
	.read = seq_read,
	.llseek = seq_lseek,
	.write = my_proc_write
};



// Definicion de evento principal
static int __init on_init(void) 
{
    struct proc_dir_entry *entry;

	entry = proc_create("memo_201603157",0777,NULL,&operaciones);
	
    if(!entry){
		return -1;	
	}else{
		printk(KERN_INFO "Creando proc file... 201603157\n");
	}

	return 0;
}

static void __exit on_exit(void) 
{
    // Código dentro del evento EXIT
    remove_proc_entry("memo_201603157", NULL);
    printk(KERN_INFO "Removiendo modulo ram SOPES 1\n");
}

// esta llamada carga la función que se ejecutará en el init
module_init(on_init);

// esta llamada carga la función que se ejecutará en el exit
module_exit(on_exit);

/*
al utilizar el comando free -m comparamos los valores con los mios:
total_ram        -> total
free_ram         -> libre
usage_ram        -> usado 
usage_percentage -> 
*/