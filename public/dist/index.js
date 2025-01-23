"use strict";
document.addEventListener('DOMContentLoaded', function () {
    (function () {
        var NotificationPlatform;
        (function (NotificationPlatform) {
            NotificationPlatform["SMS"] = "SMS";
            NotificationPlatform["EMAIL"] = "EMAIL";
            NotificationPlatform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
        })(NotificationPlatform || (NotificationPlatform = {}));
        var ViewMode;
        (function (ViewMode) {
            ViewMode["TODO"] = "TODO";
            ViewMode["REMINDER"] = "REMINDER";
        })(ViewMode || (ViewMode = {}));
        var UUID = function () {
            return Math.random().toString(32).substr(2, 9);
        };
        var DateUtils = {
            tomorrow: function () {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
            },
            today: function () {
                return new Date();
            },
            formatDate: function (date) {
                return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, ".").concat(date.getFullYear());
            }
        };
        var Reminder = /** @class */ (function () {
            function Reminder(description, date, notifications) {
                this.id = UUID();
                this.dateCreated = DateUtils.today();
                this.dateUpdated = DateUtils.today();
                this.description = ' ';
                this.date = new Date();
                this.notifications = [NotificationPlatform.EMAIL];
                this.description = description;
                this.date = date;
                this.notifications = notifications;
            }
            Reminder.prototype.render = function () {
                return "\n         ---> Lembretes <---\n         Descri\u00E7\u00E3o: ".concat(this.description, "\n         Data: ").concat(DateUtils.formatDate(this.date), "\n         Plataforma: ").concat(this.notifications.join(','), "\n         ");
            };
            return Reminder;
        }());
        var Todo = /** @class */ (function () {
            function Todo(description) {
                this.id = UUID();
                this.dateCreated = DateUtils.today();
                this.dateUpdated = DateUtils.today();
                this.description = ' ';
                this.done = false;
                this.description = description;
            }
            Todo.prototype.render = function () {
                return "\n           ---> Tarefas <---\n           Descri\u00E7\u00E3o: ".concat(this.description, "\n           Check: ").concat(this.done, "\n           ");
            };
            return Todo;
        }());
        var taskView = {
            getTodo: function (form) {
                var todoDescription = form.todoDescription.value;
                var todo = new Todo(todoDescription);
                return todo;
            },
            getReminder: function (form) {
                var reminderNotifications = [
                    form.notifications.value,
                ];
                var reminderDate = new Date(form.reminderDate.value);
                var reminderDescription = form.reminderDescription.value;
                var reminder = new Reminder(reminderDescription, reminderDate, reminderNotifications);
                return reminder;
            },
            render: function (tasks, mode) {
                var tasksList = document.getElementById('taskslist');
                console.log('pegando a lista', tasksList);
                if (tasksList) {
                    console.log("Antes de remover filhos, tasksList tem filhos?", tasksList.hasChildNodes());
                    while (tasksList.firstChild) {
                        console.log("remova filho", tasksList.firstChild);
                        tasksList.removeChild(tasksList.firstChild);
                    }
                    console.log("tasklist tem filhos?", tasksList.hasChildNodes());
                    tasks.forEach(function (task) {
                        var li = document.createElement("LI");
                        var textNode = document.createTextNode(task.render());
                        li.appendChild(textNode);
                        tasksList === null || tasksList === void 0 ? void 0 : tasksList.appendChild(li);
                    });
                    console.log('lista renderizada apos atualização', tasksList.innerHTML);
                }
                var todoSet = document.getElementById('todoSet');
                var reminderSet = document.getElementById('reminderSet');
                if (todoSet && reminderSet) {
                    if (mode === ViewMode.TODO) {
                        todoSet.style.display = 'block';
                        reminderSet.style.display = 'none';
                        reminderSet.removeAttribute('disabled');
                    }
                    else {
                        reminderSet.style.display = 'block';
                        todoSet.style.display = 'none';
                        reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute('disabled');
                    }
                }
            },
        };
        var taskController = function (view) {
            var _a, _b;
            var tasks = [];
            var mode = ViewMode.TODO;
            var handleToggleMode = function () {
                mode = mode === ViewMode.TODO ? ViewMode.REMINDER : ViewMode.TODO;
                view.render(tasks, mode);
            };
            var validateForm = function (form) {
                var todoDescription = form.todoDescription.value;
                var reminderDescription = form.reminderDescription.value;
                var reminderDate = form.reminderDate.value;
                if (mode === ViewMode.TODO) {
                    if (todoDescription.trim() === '') {
                        alert('o Campo de descrição não pode estar vazio!');
                        return false;
                    }
                }
                if (mode === ViewMode.REMINDER) {
                    if (reminderDescription.trim() === '' || reminderDate.trim() === '') {
                        alert('O campo de descrição e o campo de data não podem estar vazios!');
                        return false;
                    }
                }
                return true;
            };
            var handleEvent = function (event) {
                event.preventDefault();
                var form = event.target;
                if (!validateForm(form))
                    return;
                tasks = [];
                if (mode === ViewMode.TODO) {
                    tasks.push(view.getTodo(form));
                }
                else if (mode === ViewMode.REMINDER) {
                    tasks.push(view.getReminder(form));
                }
                view.render(tasks, mode);
                form.reset();
            };
            (_a = document.getElementById('toggleMode')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleToggleMode);
            (_b = document.getElementById('taskForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', handleEvent);
        };
        taskController(taskView);
    })();
});
