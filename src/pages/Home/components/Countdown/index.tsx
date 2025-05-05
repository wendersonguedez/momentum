import { useContext, useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../..";

export function Countdown() {
	const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
		useContext(CyclesContext);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

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
					markCurrentCycleAsFinished();

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
	}, [
		activeCycle,
		totalCycleDurationInSeconds,
		activeCycleId,
		markCurrentCycleAsFinished,
	]);

	/**
	 * `remainingTimeInSeconds`: representa a quantidade de segundos restantes do ciclo atual.
	 * Calculamos subtraindo os segundos que já se passaram do total de segundos.
	 * Se não houver ciclo ativo, retorna 0.
	 */
	const remainingTimeInSeconds = activeCycle
		? totalCycleDurationInSeconds - amountSecondsPassed
		: 0;

	/**
	 * `remainingTimeInMinutes`: representa a quantidade de minutos restantes no ciclo atual.
	 *
	 * Primeiro, dividimos os segundos restantes por 60 para obter o valor em minutos.
	 * Em seguida, usamos `Math.floor()` para arredondar para baixo,
	 * pois queremos apenas a parte inteira dos minutos — ignorando os segundos.
	 *
	 * Exemplo:
	 * - Se o tempo restante for 24 minutos e 59 segundos (1499 segundos),
	 *   `remainingSeconds / 60` resultará em 24.983...
	 *   `Math.floor()` garantirá que tenhamos apenas os 24 minutos inteiros.
	 */
	const remainingTimeInMinutes = Math.floor(remainingTimeInSeconds / 60);

	/**
	 * `remainingSeconds`: calcula os segundos restantes depois de extrair os minutos inteiros.
	 *
	 * Exemplo:
	 * - Suponha que `remainingSeconds = 1499`
	 * - Já temos `remainingMinutes = Math.floor(1499 / 60)` que dá 24 minutos
	 * - Agora, `1499 % 60` nos dá 59, que são os segundos restantes que "sobram"
	 *
	 * Esse cálculo é importante para exibir o tempo no formato `MM:SS`
	 * de forma precisa (por exemplo, 24:59).
	 */
	const remainingSeconds = remainingTimeInSeconds % 60;

	/**
	 * Quando o contador tiver apenas um dígito para minutos ou segundos (ex: 2, 3, 9),
	 * será adicionado um zero à esquerda para garantir que sempre tenhamos dois dígitos
	 * visíveis no formato `MM:SS`.
	 *
	 * Isso garante que, por exemplo, "2" minutos se torne "02" minutos, e "9" segundos
	 * se torne "09" segundos, mantendo a aparência consistente e alinhada para a contagem regressiva.
	 */
	const minutes = String(remainingTimeInMinutes).padStart(2, "0");
	const seconds = String(remainingSeconds).padStart(2, "0");

	useEffect(() => {
		if (activeCycle) {
			document.title = `${minutes}:${seconds}`;
		}
	}, [minutes, seconds, activeCycle]);

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
