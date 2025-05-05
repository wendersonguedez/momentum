import { createContext, useContext, useState } from "react";

const CyclesContext = createContext({} as any);

function NewCycleForm() {
	const { activeCycle, setActiveCycle } = useContext(CyclesContext);

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
