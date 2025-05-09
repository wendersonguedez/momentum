import {
	createContext,
	ReactNode,
	useEffect,
	useReducer,
	useState,
} from "react";
import {
	addNewCycleAction,
	interruptCurrentCycleAction,
	markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { differenceInSeconds } from "date-fns";

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
	const [cyclesState, dispatch] = useReducer(
		cyclesReducer,
		{
			cycles: [],
			activeCycleId: null,
		},
		(initialState) => {
			const storedStateAsJSON = localStorage.getItem(
				"@momentum:cycles-state-1.0.0"
			);

			if (storedStateAsJSON) {
				return JSON.parse(storedStateAsJSON);
			}

			// Caso o usuário não tenha nada no storage, irá retornar o valor do segundo parâmetro do useReducer como valor inicial,
			// sendo um array de ciclos vazios e o id do ciclo ativo como null.
			return initialState;
		}
	);

	const { cycles, activeCycleId } = cyclesState;
	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
		if (activeCycle) {
			return differenceInSeconds(new Date(), activeCycle.startDate);
		}

		return 0;
	});

	useEffect(() => {
		const stateJSON = JSON.stringify(cyclesState);

		localStorage.setItem("@momentum:cycles-state-1.0.0", stateJSON);
	}, [cyclesState]);

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds);
	}

	function markCurrentCycleAsFinished() {
		dispatch(markCurrentCycleAsFinishedAction());
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

		dispatch(addNewCycleAction(newCycle));

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
		dispatch(interruptCurrentCycleAction());
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
