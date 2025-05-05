/**
 * Este arquivo é um arquivo de definição de tipos em TypeScript.
 *
 * Ele contém apenas definições de tipos (interfaces, tipos, enums, etc.) e nunca deve incluir código JavaScript.
 * Ou seja, todo o conteúdo deste arquivo deve ser escrito exclusivamente em TypeScript.
 *
 * A interface abaixo é um exemplo ideal de código que deve ser incluído neste tipo de arquivo:
 *
 * interface ButtonProps {
 *   variant?: ButtonVariant;
 * }
 */
import "styled-components";
import { defaultTheme } from "../styles/themes/default";

type ThemeType = typeof defaultTheme;

/**
 * Declarando uma tipagem para o módulo 'styled-components', para que
 * a interface 'DefaultTheme' seja automaticamente preenchida com os valores
 * definidos no nosso tema customizado, baseado em 'ThemeType'. Isso garante
 * que o 'styled-components' saiba como aplicar as propriedades e valores
 * do nosso tema no momento da criação dos componentes estilizados.
 */
declare module "styled-components" {
	export interface DefaultTheme extends ThemeType {}
}
