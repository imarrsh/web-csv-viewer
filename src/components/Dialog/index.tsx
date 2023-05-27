import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode, useState } from 'react';
import Icon from '../Icon';
import { useDialog } from './context';

interface DialogProps {
	children: ReactNode;
}

const Dialog = ({ children }: DialogProps) => {
	const [showing, setShowing] = useState(true);

	const { closeDialog } = useDialog();

	const handleClose = () => {
		setShowing(false);
	};

	return (
		<>
			<Transition appear show={showing} as={Fragment} afterLeave={closeDialog}>
				<HeadlessDialog
					as="div"
					className="relative z-10"
					onClose={handleClose}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<div className="flex justify-between">
										<HeadlessDialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900"
										>
											Manage Profiles
										</HeadlessDialog.Title>
										<button type="button" onClick={handleClose}>
											<Icon name="XMarkIcon" />
										</button>
									</div>
									<div className="mt-2">{children}</div>
								</HeadlessDialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</HeadlessDialog>
			</Transition>
		</>
	);
};

export default Dialog;
