import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	todos: Todo[] = [];
	completedTodos: Todo[] = [];

	newTodo = '';

	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.getTodos().subscribe(todos => {
			this.todos = todos.filter(t => !t.completed);
			this.completedTodos = todos.filter(t => t.completed);
		});
	}

	toggleCompleted(todo: Todo) {
		this.http
			.post(API.UpdateTodo, { _id: todo._id, completed: todo.completed })
			.subscribe(() => {
				if (todo.completed) {
					this.completedTodos.push(todo);
					this.todos = this.todos.filter(t => t._id !== todo._id);
				} else {
					this.todos.push(todo);
					this.completedTodos = this.completedTodos.filter(t => t._id !== todo._id);
				}
			});
	}

	deleteTodo(todo: Todo) {
		this.http.post(API.DeleteTodo, { _id: todo._id }).subscribe(() => {
			this.todos = this.todos.filter(t => t._id !== todo._id);
			this.completedTodos = this.completedTodos.filter(t => t._id !== todo._id);
		});
	}

	addTodo() {
		this.http.post<Todo>(API.CreateTodo, { name: this.newTodo }).subscribe((todo) => {
			this.todos.push(todo);
			this.newTodo = '';
		});
	}

	private getTodos(): Observable<Todo[]> {
		return this.http.get<Todo[]>(API.GetTodos);
	}
}

type Todo = {
	_id: number;
	name: string;
	completed: boolean;
};

const API_URL = 'https://3788-176-233-26-59.ngrok-free.app';

enum API {
	GetTodos = API_URL + '/webhook/VEhqJ96elwfIt6Er',
	CreateTodo = API_URL + '/webhook/i5monzKqLThOwtCj',
	UpdateTodo = API_URL + '/webhook/EhGIxTHEAS77VDiv',
	DeleteTodo = API_URL + '/webhook/61lQFkpKvztOD5tH',
}
