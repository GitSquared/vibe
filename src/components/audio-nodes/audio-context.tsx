import type { GeneratorAudioComponentProps } from './types'
import type { ReactElement } from 'react'
import { createContext, useState, useEffect, cloneElement, Children } from 'react'

export const AudioReactContext = createContext<AudioContext | null>(null)

interface AudioContextComponentProps {
	children?: ReactElement<GeneratorAudioComponentProps> | ReactElement<GeneratorAudioComponentProps>[]
}

export default function AudioContextComponent(props: AudioContextComponentProps) {
	const [ctx, setCtx] = useState<AudioContext | null>(null)

	useEffect(() => {
		const context = new AudioContext()

		setCtx(context)
		return () => {
			context.close()
		}
	}, [])

	return <AudioReactContext.Provider value={ctx}>
		{props.children && Children.map(props.children, Node =>
			cloneElement<GeneratorAudioComponentProps>(Node, {
				out: ctx?.destination
			})
		)}
	</AudioReactContext.Provider>
}
