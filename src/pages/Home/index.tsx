import { HandPalm, Play } from "phosphor-react";
import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
	task: zod.string().nonempty("Informe a tarefa"),
	minutesAmount: zod
		.number()
		.min(5, "O ciclo precisa ser de no mínimo 5 minutos")
		.max(60, "O ciclo precisa ser de no máximo 60 minutos."),
});

/**
 * Isso garante que a tipagem do formulário esteja sempre sincronizada com as regras de validação,
 * evitando divergências entre o que é validado e o que é esperado como tipo.
 *
 * Caso novas informações sejam adicionadas ao esquema de validação, a tipagem será atualizada
 * automaticamente, mantendo tudo consistente sem precisar definir os tipos manualmente.
 */
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
	const { createNewCycle, interruptCurrentCycle, activeCycle } =
		useContext(CyclesContext);
	const newCycleForm = useForm<NewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: "",
			minutesAmount: 0,
		},
	});

	const { handleSubmit, watch /*reset*/ } = newCycleForm;

	const task = watch("task");
	const isSubmitDisabled = !task;

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(createNewCycle)} action="">
				<FormProvider {...newCycleForm}>
					<NewCycleForm />
				</FormProvider>

				<Countdown />

				{activeCycle ? (
					<StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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
