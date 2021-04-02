import type { ProcessorAudioComponentProps } from './types'
import type { ReactElement } from 'react'
import { useState, useEffect, cloneElement, Children } from 'react'

interface PatchBayProps {
	children?: ReactElement<ProcessorAudioComponentProps> | ReactElement<ProcessorAudioComponentProps>[]
	in?: AudioNode
	out?: AudioNode
}

interface PatchControl {
	in?: AudioNode
	out?: AudioNode
}

export default function PatchBay(props: PatchBayProps) {
	const [nodes, setNodes] = useState<Record<number, AudioNode>>({})
	const [patch, setPatch] = useState<Record<number, PatchControl>>({})

	useEffect(() => {
		const p: Record<number, PatchControl> = {}
		for (const i in nodes) {
			p[i] = {}

			const before = nodes[Number(i) - 1]
			if (!before) p[i].in = props.in

			const after = nodes[Number(i) + 1]
			p[i].out = (after) ? after : props.out
		}

		setPatch(p)
	}, [nodes, props.in, props.out])

	return <>
		{props.children && Children.map(props.children, (Node, i) => {
			return cloneElement<ProcessorAudioComponentProps>(Node, {
				in: patch[i]?.in,
				out: patch[i]?.out,
				onNodeSpawn: audioNode => {
					if (typeof Node.props.onNodeSpawn === 'function') Node.props.onNodeSpawn(audioNode)
					setNodes(nodes => {
						nodes[i] = audioNode
						return { ...nodes }
					})
				}
			})
		})}
	</>
}
