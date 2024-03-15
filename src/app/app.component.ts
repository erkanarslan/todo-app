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

const API_URL = 'https://app.monkedo.com/webhook/';

enum API {
	GetTodos = API_URL + '6eSfPIGASGhf54An',
	CreateTodo = API_URL + '1VQjnHZwx1KDkptb',
	UpdateTodo = API_URL + 'feTQbm8kBosih6kg',
	DeleteTodo = API_URL + 'GEFXc0FeJWg0LB7v',
}
