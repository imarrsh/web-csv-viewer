import {
	ReactElement,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from 'react';

export interface DialogContext {
	openDialog: (modal_: ReactElement) => void;
	closeDialog: (modalId?: string) => void;
}

const defaultContext: DialogContext = {
	openDialog: () => '',
	closeDialog: () => null,
};

const DialogContext = createContext(defaultContext);

export const useDialog = () => {
	if (!DialogContext) {
		throw Error(`'useDialog' must be used within DialogProvider`);
	}
	return useContext(DialogContext);
};

interface DialogProviderProps {
	children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
	const [modal, setModal] = useState<ReactElement | null>(null);

	const openDialog = useCallback((el: ReactElement) => {
		setModal(el);
	}, []);

	const closeDialog = useCallback(() => {
		setModal(null);
	}, []);

	return (
		<DialogContext.Provider
			value={{
				openDialog,
				closeDialog,
			}}
		>
			{children}
			{modal}
		</DialogContext.Provider>
	);
};
