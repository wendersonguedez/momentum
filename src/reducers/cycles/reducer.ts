import { ActionTypes } from "./actions";
import { produce } from "immer";

export interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

interface CyclesState {
	cycles: Cycle[];
	activeCycleId: string | null;
}

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
export function cyclesReducer(state: CyclesState, action: any) {
	switch (action.type) {
		/**
		 * Retorna um objeto contendo os estados anteriores, com um array de ciclos
		 * e adiciona um novo ciclo ao final. Por fim, define o novo ciclo como ativo.
		 */
		case ActionTypes.ADD_NEW_CYCLE:
			return produce(state, (draft) => {
				draft.cycles.push(action.payload.newCycle);
				draft.activeCycleId = action.payload.newCycle.id;
			});
		case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
			const currentCycleIndex = state.cycles.findIndex((cycle) => {
				return cycle.id === state.activeCycleId;
			});

			if (currentCycleIndex < 0) {
				return state;
			}

			return produce(state, (draft) => {
				draft.activeCycleId = null;
				draft.cycles[currentCycleIndex].interruptedDate = new Date();
			});
		}
		case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
			const currentCycleIndex = state.cycles.findIndex((cycle) => {
				return cycle.id === state.activeCycleId;
			});

			if (currentCycleIndex < 0) {
				return state;
			}

			return produce(state, (draft) => {
				draft.activeCycleId = null;
				draft.cycles[currentCycleIndex].finishedDate = new Date();
			});
		}
		default:
			return state;
	}
}
