import WebSocket from "isomorphic-ws";

const SOCKET_URL = `${globalThis.location?.hostname || "0.0.0.0"}`;
export const SOCKET_PORT = 7273;

interface SocketFunctions {
	onOpen?: () => void;
	onClose?: () => void;
	onError?: (error: string) => void;
	supportedMessages: { [type: string]: (data: any) => void };
}

export const createSocket = ({ onOpen, onClose, onError, supportedMessages }: SocketFunctions) => {
	let currentClient: WebSocket;

	function attemptToReconnect() {
		const TIME_TO_RECONNECT = 5000;
		setTimeout(() => {
			console.log('Attempting to reconnect');
			recreateSocket();
		}, TIME_TO_RECONNECT);
	}

	function recreateSocket() {
		const client = new WebSocket(`ws://${SOCKET_URL}:${SOCKET_PORT}`);

		client.onerror = (error) => {
			onError?.(error.message);
			console.error(error);
		};

		client.onopen = () => {
			onOpen?.();
		};

		client.onclose = () => {
			onClose?.();
			client.close();
			attemptToReconnect();
		};

		client.onmessage = ({ data: rawData }) => {
			const {type, ...data} = JSON.parse(rawData.toString());
			if (!type) {
				console.warn("No type was received for the event.");
				return;
			}
			if (!(type.toLowerCase() in supportedMessages)) {
				console.warn(`Type ${type} is not supported in ${Object.keys(supportedMessages)}.`);
				return;
			}

			supportedMessages[type.toLowerCase()](data);
		};

		currentClient = client;
	}

	recreateSocket();

	return {
		getSocket: () => currentClient,
		send: (data: unknown) => currentClient.send(data)
	};
};
