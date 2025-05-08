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

export enum ActionTypes {
	ADD_NEW_CYCLE = "ADD_NEW_CYCLE",
	INTERRUPT_CURRENT_CYCLE = "INTERRUPT_CURRENT_CYCLE",
	MARK_CURRENT_CYCLE_AS_FINISHED = "MARK_CURRENT_CYCLE_AS_FINISHED",
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
	switch (action) {
		/**
		 * Retorna um objeto contendo os estados anteriores, com um array de ciclos
		 * e adiciona um novo ciclo ao final. Por fim, define o novo ciclo como ativo.
		 */
		case ActionTypes.ADD_NEW_CYCLE:
			return {
				...state,
				cycles: [...state.cycles, action.payload.newCycle],
				activeCycleId: action.payload.newCycle.id,
			};
		case ActionTypes.INTERRUPT_CURRENT_CYCLE:
			// Verifica se a ação é de interromper o ciclo ativo
			return {
				...state, // Mantém todos os estados anteriores inalterados
				cycles: state.cycles.map((cycle) => {
					// Mapeia todos os ciclos
					if (cycle.id === state.activeCycleId) {
						// Verifica se o ciclo é o ciclo ativo
						return {
							...cycle, // Faz uma cópia do ciclo
							interruptedDate: new Date(), // Adiciona a data de interrupção no ciclo ativo
						};
					} else {
						return cycle; // Retorna o ciclo inalterado se não for o ciclo ativo
					}
				}),
				activeCycleId: null, // Define o ciclo ativo como nulo, indicando que não há ciclo ativo
			};
		case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
			return {
				...state, // Mantém todos os estados anteriores inalterados
				cycles: state.cycles.map((cycle) => {
					// Mapeia todos os ciclos
					if (cycle.id === state.activeCycleId) {
						// Verifica se o ciclo é o ciclo ativo
						return {
							...cycle, // Faz uma cópia do ciclo
							finishedDate: new Date(), // Adiciona a data de finalização no ciclo ativo
						};
					} else {
						return cycle; // Retorna o ciclo inalterado se não for o ciclo ativo
					}
				}),
				activeCycleId: null, // Define o ciclo ativo como nulo, indicando que não há ciclo ativo
			};
		default:
			return state;
	}
}
