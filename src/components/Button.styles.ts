import { styled, css } from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "danger" | "success";

interface ButtonContainerProps {
	variant: ButtonVariant;
}

const buttonVariants = {
	primary: "purple",
	secondary: "orange",
	danger: "red",
	success: "green",
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
	width: 100px;
	height: 40px;
	border-radius: 4px;
	border: 0;
	margin: 8px;
	cursor: pointer;

	background-color: ${(props) => props.theme};
	color: ${(props) => props.theme.white};

	/**
        O código abaixo será executado como uma função pelo styled-components, enviando todas as
        propriedades do ButtonContainer, que até o momento temos 'variant' 
    */
	/* ${(props) => {
		return css`
			background-color: ${buttonVariants[props.variant]};
		`;
	}} */
`;
