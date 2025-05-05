import { createContext, useContext, useState } from "react";

/**
 * Criando o contexto com o hook createContext, que será utilizado pelo hook useContext
 * para acessar os dados compartilhados por esse contexto em outros componentes.
 */
const CyclesContext = createContext({} as any);

function NewCycleForm() {
	const { activeCycle } = useContext(CyclesContext);

	return <h1>New Cycle Form: {activeCycle}</h1>;
}

function Countdown() {
	const { activeCycle, setActiveCycle } = useContext(CyclesContext);

	return (
		<>
			<button onClick={() => setActiveCycle((prevValue) => prevValue + 1)}>
				Alterar Ciclo ativo
			</button>
			<h1>Countdown: {activeCycle}</h1>
		</>
	);
}

export function Home() {
	const [activeCycle, setActiveCycle] = useState(0);

	/**
	 * value={{ activeCycle, setActiveCycle }} são as propriedades que os componentes filho irão ter acesso
	 *
	 * Ao utilizar a função set do state, ambos os componentes terão seus valores atualizados.
	 */
	return (
		<CyclesContext.Provider value={{ activeCycle, setActiveCycle }}>
			<div>
				<Countdown />
				<NewCycleForm />
			</div>
		</CyclesContext.Provider>
	);
}
