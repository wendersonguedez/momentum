import { HandPalm, Play } from "phosphor-react";
import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

import { createContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
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
	activeCycle:
}

const CyclesContext = createContext({});

export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	/**
	 *
	 * @param data - Os dados dos inputs do formulário
	 */
	function handleCreateNewCycle(data: NewCycleFormData) {
		const id = String(new Date().getTime());

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		};

		setCycles((state) => [...state, newCycle]);
		setActiveCycleId(id);
		setAmountSecondsPassed(0);

		reset();
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

	const task = watch("task");
	const isSubmitDisabled = !task;

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
				<NewCycleForm />
				<Countdown />
				{activeCycle ? (
					<StopCountdownButton type="button" onClick={handleInterruptCycle}>
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton disabled={isSubmitDisabled} type="submit">
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	);
}
