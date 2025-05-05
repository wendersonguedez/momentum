import styled from "styled-components";

export const HeaderContainer = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;

	nav {
		display: flex;
		gap: 0.5rem;

		a {
			width: 3rem;
			height: 3rem;

			display: flex;
			justify-content: center;
			align-items: center;

			color: ${(props) => props.theme["gray-100"]};

			border-top: 3px solid transparent;
			border-bottom: 3px solid transparent;

			background: linear-gradient(
				to right,
				${(props) => props.theme["green-500"]} 100%,
				transparent 100%
			);
			background-repeat: no-repeat;
			background-position: bottom left;
			background-size: 0% 3px;

			transition: background-size 0.3s ease-in-out;

			&:hover {
				background-size: 100% 3px;
			}

			&.active {
				color: ${(props) => props.theme["green-500"]};
			}
		}
	}
`;
