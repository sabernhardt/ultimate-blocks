import React from 'react';
import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import proxyquire from 'proxyquire';

const mockHamburgerMenu = () => {
	return proxyquire(require.resolve('$Components/HamburgerMenu'), {
		'@fortawesome/react-fontawesome': {
			FontAwesomeIcon: ({ icon }) => <div>{icon}</div>,
		},
	}).default;
};

describe('HamburgerMenu', () => {
	it('should use its callback property on click', async () => {
		const clickHandler = sinon.spy();

		const MockedHamburgerMenu = mockHamburgerMenu();

		render(<MockedHamburgerMenu clickHandler={clickHandler} />);
		await userEvent.click(screen.getByRole('button'));
		expect(clickHandler.calledOnce).to.be.ok();
	});
	it('should only call click handler with enter key from keyboard on focus', async () => {
		const clickHandler = sinon.spy();

		const MockedHamburgerMenu = mockHamburgerMenu();
		render(<MockedHamburgerMenu clickHandler={clickHandler} />);
		const hamburgerMenuOnScreen = screen.getByRole('button');
		hamburgerMenuOnScreen.focus();

		await userEvent.keyboard('{enter}', hamburgerMenuOnScreen);
		expect(clickHandler.calledOnce).to.be.ok();

		clickHandler.resetHistory();

		await userEvent.keyboard('a', hamburgerMenuOnScreen);
		expect(clickHandler.calledOnce).to.be.false();
	});
	it('should render correct icon with current status', () => {
		const MockedHamburgerMenu = mockHamburgerMenu();

		const { unmount } = render(
			<MockedHamburgerMenu status={false} openIcon={'open'} />
		);
		expect(screen.getByText('open')).to.be.ok();

		unmount();

		render(<MockedHamburgerMenu status={true} closeIcon={'close'} />);
		expect(screen.getByText('close')).to.be.ok();
	});
});
