import { createContext, ReactNode, useReducer, useState } from "react";

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

interface CreateCycleData {
	task: string;
	minutesAmount: number;
}

interface CyclesContextType {
	cycles: Cycle[];
	activeCycle: Cycle | undefined;
	activeCycleId: string | null;
	amountSecondsPassed: number;
	markCurrentCycleAsFinished: () => void;
	setSecondsPassed: (seconds: number) => void;
	createNewCycle: (data: CreateCycleData) => void;
	interruptCurrentCycle: () => void;
}

/**
 * ReactNode representa todas as coisas que o React pode renderizar, sendo uma <div>, <Component />
 */
interface CyclesContextProviderProps {
	children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
	children,
}: CyclesContextProviderProps) {
	/**
	 * Utilizando useReducer para atualização do estado dos ciclos.
	 * @param state - O estado atual da lista de ciclos. Representa a variável `cycles` dentro da função `reducer`.
	 * @param action - A ação que será realizada sobre o estado (por exemplo, adicionar um novo ciclo).
	 *
	 * @returns - O retorno do useReducer é o novo valor que o estado cycles irá receber
	 *
	 * O nome `dispatch` é utilizado por convenção, pois é o método responsável por enviar as ações para o `reducer`.
	 * Ele permite que o estado seja atualizado de acordo com as ações disparadas.
	 * A alteração do nome da função para `dispatch` segue a convenção do React e facilita a compreensão
	 * do código por outros desenvolvedores familiarizados com essa prática.
	 */
	const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
		console.log(state);
		console.log(action);
		if (action.type === "ADD_NEW_CYCLE") {
			return [...state, action.payload.newCycle]; // Adiciona o novo ciclo ao estado
		}

		return state;
	}, []);

	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds);
	}

	function markCurrentCycleAsFinished() {
		dispatch({
			type: "MARK_CURRENT_CYCLE_AS_FINISHED",
			payload: {
				activeCycleId,
			},
		});
		// setCycles((previousCycles) =>
		// 	previousCycles.map((cycle) => {
		// 		if (cycle.id === activeCycleId) {
		// 			return { ...cycle, finishedDate: new Date() };
		// 		} else {
		// 			return cycle;
		// 		}
		// 	})
		// );
	}

	/**
	 * @param data - Os dados dos inputs do formulário
	 */
	function createNewCycle(data: CreateCycleData) {
		const id = String(new Date().getTime());

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		};

		dispatch({
			type: "ADD_NEW_CYCLE",
			payload: {
				newCycle,
			},
		});

		// setCycles((state) => [...state, newCycle]);
		setActiveCycleId(id);
		setAmountSecondsPassed(0);
	}

	/**
	 * Função para interromper um ciclo, onde verifica se o ciclo a ser interrompido é o atual
	 * se for, retorna todos os dados dele, mas adiciona a data de interrupção
	 * se não for, apenas retorna o ciclo, sem alterações.
	 *
	 * Lembrando que no React, nunca podemos alterar uma informação sem seguir os principio da
	 * imutabilidade. No caso abaixo, por estarmos trabalhando com arrays de objetos, fica um pouco mais
	 * trabalhoso, já que caso queira trocar uma informação de um desses objetos (desse array de ciclos),
	 * eu obrigatóriamente preciso percorrer todos os itens do array, procurando pelo objeto que quero alterar
	 * pra daí fazer a alteração.
	 */
	function interruptCurrentCycle() {
		dispatch({
			type: "INTERRUPT_CURRENT_CYCLE",
			payload: {
				activeCycleId,
			},
		});
		// setCycles((previousCycles) =>
		// 	previousCycles.map((cycle) => {
		// 		if (cycle.id === activeCycleId) {
		// 			return { ...cycle, interruptedDate: new Date() };
		// 		} else {
		// 			return cycle;
		// 		}
		// 	})
		// );

		setActiveCycleId(null);
	}

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
				amountSecondsPassed,
				setSecondsPassed,
				createNewCycle,
				interruptCurrentCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	);
}
