#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/sys.h>
#include <linux/sysinfo.h>
#include <linux/sched.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/mm.h>
#include <linux/sched/task.h>
#include <linux/sched/signal.h>

static int device_open(struct inode * , struct file * );
static int device_release(struct inode * , struct file * );
static ssize_t device_read(struct file * , char * , size_t, loff_t * );
static ssize_t device_write(struct file * ,
  const char * , size_t, loff_t * );
  
struct task_struct *task;
struct task_struct *task_child;
struct list_head *list;

MODULE_LICENSE("GPL");
MODULE_AUTHOR("RUNI");
MODULE_DESCRIPTION("Modulo de cpu");
MODULE_VERSION("1.0");

static char *str = NULL;


static int my_proc_show(struct seq_file *archivo,void *v){

    seq_printf(archivo, "[");
	
    int contador = 0;
    int contadorHijos = 0;
    
    for_each_process( task ){
        
        if(contador != 0) {
            seq_printf(archivo, ",");
        }

        contadorHijos = 0;

        seq_printf(archivo, "{");
        seq_printf(archivo, "\"pid\": %d,", task->pid);
        seq_printf(archivo, "\"name\": \"%s\",", task->comm);
        seq_printf(archivo, "\"state\": %ld,", task->state);
        seq_printf(archivo,  "\"uid\": %d,", __kuid_val(task->real_cred->uid));
        seq_printf(archivo, "\"childs\": [");
        //seq_printf(archivo, "PARENT PID: %d PROCESS: %s STATE: %ld",task->pid, task->comm, task->state);/*    log parent id/executable name/state    */
        list_for_each(list, &task->children){                        /*    list_for_each MACRO to iterate through task->children    */

            if(contadorHijos != 0) {
                seq_printf(archivo, ",");
            }

            task_child = list_entry( list, struct task_struct, sibling );    /*    using list_entry to declare all vars in task_child struct    */

            seq_printf(archivo, "{");
            seq_printf(archivo, "\"pid\": %d,", task_child->pid);
            seq_printf(archivo, "\"name\": \"%s\",", task_child->comm);
            seq_printf(archivo, "\"state\": %ld", task_child->state);
            
            seq_printf(archivo, "}");
            
            contadorHijos++;
        }
        seq_printf(archivo, "]");
        seq_printf(archivo, "}");
        contador++;
    } 

    seq_printf(archivo, "]");

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

	entry = proc_create("cpu_201603157",0777,NULL,&operaciones);
	
    if(!entry){
		return -1;	
	}else{
		printk(KERN_INFO "Ricardo Antonio Alvarado Ramirez");
	}

	return 0;
}

static void __exit on_exit(void) 
{
    // Código dentro del evento EXIT
    remove_proc_entry("cpu_201603157", NULL);
    printk(KERN_INFO "Removiendo modulo Diciembre 2021");
}

// esta llamada carga la función que se ejecutará en el init
module_init(on_init);

// esta llamada carga la función que se ejecutará en el exit
module_exit(on_exit);
