
document.addEventListener('DOMContentLoaded', () => {
(() => {
    enum NotificationPlatform { 
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
    }
    enum ViewMode {
        TODO = 'TODO',
        REMINDER = 'REMINDER',
    }
 
    const UUID = (): string => {
       return Math.random().toString(32).substr(2, 9);
    };
 
    const DateUtils = {
        tomorrow(): Date {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },

        today(): Date {
            return new Date();
        },

        formatDate(date: Date): string{
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        }   
    }    
    interface Task {
        id: string;
        dateCreated: Date;
        dateUpdated: Date;
        description: string;
        render(): string;
    }
    class Reminder implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = ' ';
  
        date: Date = new Date();
        notifications: Array<NotificationPlatform> = [NotificationPlatform.EMAIL];
      
        constructor(description: string, date: Date, notifications: Array<NotificationPlatform>) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string {
         return `
         ---> Lembretes <---
         Descrição: ${this.description}
         Data: ${DateUtils.formatDate(this.date)}
         Plataforma: ${this.notifications.join(',')}
         `;
        }
    }
    
    class Todo implements Task{
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = ' ';

        done: boolean = false;

        constructor(description: string){
            this.description = description;
        }

        render(): string {
           return `
           ---> Tarefas <---
           Descrição: ${this.description}
           Check: ${this.done}
           `;
        }
        
    }


    const taskView = {
        getTodo (form: HTMLFormElement): Todo {
            const todoDescription = form.todoDescription.value;
            const todo = new Todo(todoDescription);
            return todo;
        },
        getReminder (form: HTMLFormElement): Reminder {
            const reminderNotifications = [
                form.notifications.value as NotificationPlatform,
            ];
            const reminderDate = new Date(form.reminderDate.value);
            const reminderDescription = form.reminderDescription.value;
            const reminder = new Reminder (
                reminderDescription,
                reminderDate,
                reminderNotifications
            );      
            return reminder;
        },
        
        render(tasks: Array<Task>, mode: ViewMode){
            const tasksList = document.getElementById('taskslist');
            console.log('pegando a lista', tasksList);
         if(tasksList){
           
            console.log("Antes de remover filhos, tasksList tem filhos?", tasksList.hasChildNodes());
            while(tasksList.firstChild){
                console.log("remova filho", tasksList.firstChild);
                tasksList.removeChild(tasksList.firstChild);
             }


             console.log("tasklist tem filhos?", tasksList.hasChildNodes());

             tasks.forEach ((task) => {
                const li = document.createElement("LI");
                const textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList?.appendChild(li);
 
             });

             console.log('lista renderizada apos atualização', tasksList.innerHTML);
            }
            const todoSet = document.getElementById('todoSet');
            const reminderSet = document.getElementById('reminderSet');

            if(todoSet && reminderSet){
                if (mode === ViewMode.TODO){
                    todoSet.style.display = 'block';
                    reminderSet.style.display = 'none';
                    reminderSet. removeAttribute('disabled');
                } else {
                  reminderSet.style.display = 'block';
                  todoSet.style.display = 'none';
                  reminderSet?.removeAttribute('disabled');
                }
            }
        },
    }

    const taskController = (view: typeof taskView) => {
        let tasks: Array<Task> = [];
        let mode: ViewMode = ViewMode.TODO;

        const handleToggleMode = () => {
           mode = mode === ViewMode.TODO ? ViewMode.REMINDER : ViewMode.TODO;
           view.render(tasks, mode);
        }
      
        const validateForm = (form: HTMLFormElement) => {
            const todoDescription = form.todoDescription.value;
            const reminderDescription = form.reminderDescription.value;
            const reminderDate = form.reminderDate.value;  
        
        
         if (mode === ViewMode.TODO){
              if(todoDescription.trim() === ''){
                 alert('o Campo de descrição não pode estar vazio!');
                 return false;
                }
            }
         if (mode === ViewMode.REMINDER){
              if(reminderDescription.trim() === '' || reminderDate.trim() === ''){
                alert('O campo de descrição e o campo de data não podem estar vazios!');
                return false;
              }
            }  
         return true; 
        }
        const handleEvent = (event: Event) => {
            event.preventDefault()
            const form = event.target as HTMLFormElement;

            if(!validateForm(form)) return;
            
            tasks = [];
            if (mode === ViewMode.TODO) {
                tasks.push(view.getTodo(form));
            }
            else if (mode === ViewMode.REMINDER){
                tasks.push(view.getReminder(form));  
            }
            view.render(tasks, mode);
            form.reset();
        };

        
        document.getElementById('toggleMode')?.addEventListener('click', handleToggleMode);
        document.getElementById('taskForm')?.addEventListener('submit', handleEvent);
    };

    taskController(taskView);
}) ();
}) 

