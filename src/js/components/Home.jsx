import React,{useState, useEffect} from "react";

const Home = () => {

	const urlApi = "https://playground.4geeks.com/todo/users/jaimito";
	const urlApiTodos = "https://playground.4geeks.com/todo/todos/jaimito";
	const urlApiDelete = (id)=>"https://playground.4geeks.com/todo/todos/"+id;

	const [tareas, setTareas] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ nuevaTarea, setNuevaTarea] = useState("");

	const fetchTareas = async () =>{
		try {
			const response = await fetch(urlApi);
			const data = await response.json();
			setTareas(data.todos);
		} catch (error) {
			console.log("Error ",error);
		}finally {
			setIsLoading(false);
		  }
	};

	const nuevaTareaPost = async () =>{
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			"label": nuevaTarea,
			"is_done": false
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw
		};

		try{
			const response = await fetch(urlApiTodos, requestOptions);
			const data = await response.json();
			setNuevaTarea("");
			await fetchTareas();
		}catch(error){
			console.log("Error", error);
		}
	}

	const eliminarTarea = async(id) =>{
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const requestOptions = {
			method: "DELETE",
			headers: myHeaders
		};
		
		try{
			const response = await fetch(urlApiDelete(id), requestOptions);
			await fetchTareas();
		}catch{
			console.log("Error", error);
		}
	}
	

	const enviarTarea = (evento) =>{
		if(evento.key == "Enter"){
			nuevaTareaPost();
		}
	}

	const ListarTareas= (props) =>{
		const [hidden, setHidden] = useState(true);
		return (
			<div className="d-flex align-items-center form-control" style={{borderBottom:"1px solid #e3e3e3", backgroundColor:"white"}}
						onMouseEnter={()=>{	setHidden(false); }}
						onMouseLeave={()=>{ setHidden(true); }}>	
							<p className="p-3 col-11 fs-3 fw-light text-start" style={{marginBottom:"0"}} key={props.task}>{props.task}</p>
							{hidden ? null :
								<i className="col-1 fa-duotone fa-solid fa-xmark " onClick={()=>{
									eliminarTarea(props.id);
									}}>
								</i>
							}
			</div>
		)
	}

	useEffect(() => {
		fetchTareas();
	  }, []);

	return (
		<div className="text-center">
			<h1 className="text-center mt-5 display-1">todos</h1>
			<div className="col-4 mx-auto">
				<input type="text" className="form-control p-3" placeholder="What needs to be done" value={nuevaTarea || ""} 
				onChange={(e) => setNuevaTarea(e.target.value)} 
				onKeyDown={enviarTarea} />
				{isLoading && <p>Loading...</p>}
				{
					tareas.map(task => <ListarTareas key={task.id} task={task.label} id={task.id} />)
				}
				{ tareas.length == 0 && 
					<div className="form-control text-body-tertiary" style={{backgroundColor:"white"}}>
						<p className="text-start" style={{marginBottom:"0", fontSize:"12px"}}> No hay tareas, añadir tareas</p>
					</div>
				}
				{ tareas.length !== 0 && 
					<div className="form-control text-body-tertiary" style={{backgroundColor:"white"}}>
						<p className="text-start" style={{marginBottom:"0", fontSize:"12px"}}> se añadió {tareas.length} tarea</p>
					</div>
					
				}
			</div>
			
		</div>
	);
};

export default Home;