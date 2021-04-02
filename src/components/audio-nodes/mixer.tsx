import type { ProcessorAudioComponentProps } from './types'
import type { ReactElement } from 'react'
import { useEffect, cloneElement, Children } from 'react'

interface MixerProps {
	children?: ReactElement<ProcessorAudioComponentProps> | ReactElement<ProcessorAudioComponentProps>[]
	in?: AudioNode
	out?: AudioNode
	onNodeSpawn?: () => void
}

export default function Mixer(props: MixerProps) {
	useEffect(() => {
		if (typeof props.onNodeSpawn === 'function') props.onNodeSpawn()
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [])

	return <>
		{props.children && Children.map(props.children, Node =>
			cloneElement<ProcessorAudioComponentProps>(Node, {
				in: props.in,
				out: props.out
			})
		)}
	</>
}
