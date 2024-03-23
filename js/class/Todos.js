import { Task } from './Task.js';

class Todos {
    #tasks = [];
    #backend_url = '';

    constructor(url) {
        this.#backend_url = url;
    }

    getTasks() {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backend_url)
                .then(response => response.json())
                .then(json => {
                    this.#readJSON(json);
                    resolve(this.#tasks);
                },(error) => {
                    reject(error);
                })
     })

    }

    #readJSON = (taskAsJson) => {
        taskAsJson.forEach(node => {
            const task = new Task(node.id, node.description);
            this.#tasks.push(task);
        });
    }

    #addToArray = (id, text) => {
        const task = new Task(id, text);
        this.#tasks.push(task);
        return task;
    }

    addTask = (text) => {
        return new Promise(async (resolve, reject) => {
            const json = JSON.stringify({description: text});
            fetch(this.#backend_url + "/new", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            })
            .then(response => response.json())
            .then(json => {
                resolve(this.#addToArray(json.id, text));
                console.log(error)
            }, (error) => {
                reject(error);
                console.log(error)
            })
        })
    }

    removeTask = (id) => {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backend_url + "/delete/" + id, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(json => {
                this.#removeFromArray(json.id);
                resolve(json.id);
            }, (error) => {
                reject(error);
            })
        })
    }

    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#tasks = this.#tasks.filter(task => task.id !== id)
        this.#tasks = arrayWithoutRemoved;
    }

}

export { Todos }