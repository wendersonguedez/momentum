import { HandPalm, Play } from "phosphor-react";
import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

import { createContext, useState } from "react";
// import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

interface CyclesContextType {
	activeCycle: Cycle | undefined;
	activeCycleId: string | null;
	markCurrentCycleAsFinished: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	function markCurrentCycleAsFinished() {
		setCycles((previousCycles) =>
			previousCycles.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, finishedDate: new Date() };
				} else {
					return cycle;
				}
			})
		);
	}

	/**
	 *
	 * @param data - Os dados dos inputs do formulário
	 */
	// function handleCreateNewCycle(data: NewCycleFormData) {
	// 	const id = String(new Date().getTime());

	// 	const newCycle: Cycle = {
	// 		id,
	// 		task: data.task,
	// 		minutesAmount: data.minutesAmount,
	// 		startDate: new Date(),
	// 	};

	// 	setCycles((state) => [...state, newCycle]);
	// 	setActiveCycleId(id);
	// 	setAmountSecondsPassed(0);

	// 	reset();
	// }

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
	function handleInterruptCycle() {
		setCycles((previousCycles) =>
			previousCycles.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, interruptedDate: new Date() };
				} else {
					return cycle;
				}
			})
		);

		setActiveCycleId(null);
	}

	// const task = watch("task");
	// const isSubmitDisabled = !task;

	return (
		<HomeContainer>
			<form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">
				<CyclesContext.Provider
					value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}
				>
					{/* <NewCycleForm /> */}
					<Countdown />
				</CyclesContext.Provider>

				{activeCycle ? (
					<StopCountdownButton type="button" onClick={handleInterruptCycle}>
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit">
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	);
}
