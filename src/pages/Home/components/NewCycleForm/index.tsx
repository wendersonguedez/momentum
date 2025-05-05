import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

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

export function NewCycleForm() {
	const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: "",
			minutesAmount: 0,
		},
	});

	return (
		<FormContainer>
			<label htmlFor="task">Vou trabalhar em</label>
			<TaskInput
				type="text"
				id="task"
				placeholder="Dê um nome para seu projeto"
				list="task-suggestions"
				disabled={!!activeCycle}
				{...register("task")}
			/>

			<datalist id="task-suggestions">
				<option value="Projeto 1" />
				<option value="Projeto 2" />
				<option value="Projeto 3" />
				<option value="Banana" />
			</datalist>

			<label htmlFor="minutesAmount">durante</label>
			<MinutesAmountInput
				type="number"
				id="minutesAmount"
				placeholder="00"
				step={5}
				min={5}
				max={60}
				disabled={!!activeCycle}
				{...register("minutesAmount", { valueAsNumber: true })}
			/>

			<span>minutos.</span>
		</FormContainer>
	);
}
