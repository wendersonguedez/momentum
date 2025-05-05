import { useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";

export function Countdown() {
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	/**
	 * `totalCycleDurationInSeconds`: representa a duração do ciclo em segundos.
	 * Fazemos a conversão de minutos para segundos (1 minuto = 60 segundos).
	 * Caso não exista um ciclo ativo, o valor será 0.
	 */
	const totalCycleDurationInSeconds = activeCycle
		? activeCycle.minutesAmount * 60
		: 0;

	/**
	 * Responsável por controlar os segundos que se passaram, desde a criação do ciclo, caso tenha
	 * um ciclo ativo.
	 */
	useEffect(() => {
		let interval: number;

		if (activeCycle) {
			interval = setInterval(() => {
				const secondsDifference = differenceInSeconds(
					new Date(),
					activeCycle.startDate
				);

				/**
				 * Se a quantidade de segundos percorridos for maior ou igual ao tempo total do ciclo,
				 * marca o ciclo atual como finalizado (adicionando a data de finalização).
				 *
				 * Caso contrário, apenas atualiza a quantidade de segundos que já se passaram,
				 * desde que o ciclo ainda não tenha sido completado.
				 */
				if (secondsDifference >= totalCycleDurationInSeconds) {
					setCycles((previousCycles) =>
						previousCycles.map((cycle) => {
							if (cycle.id === activeCycleId) {
								return { ...cycle, finishedDate: new Date() };
							} else {
								return cycle;
							}
						})
					);

					setAmountSecondsPassed(totalCycleDurationInSeconds);
					clearInterval(interval);
				} else {
					setAmountSecondsPassed(secondsDifference);
				}
			}, 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [activeCycle, totalCycleDurationInSeconds, activeCycleId]);

	return (
		<CountdownContainer>
			<span>{minutes[0]}</span>
			<span>{minutes[1]}</span>
			<Separator>:</Separator>
			<span>{seconds[0]}</span>
			<span>{seconds[1]}</span>
		</CountdownContainer>
	);
}
