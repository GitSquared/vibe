import { useState, useEffect } from 'react'
import styles from './knob.module.scss'

interface KnobProps {
	value: number
	onChange: (e: number) => void
	min: number
	max: number
	label?: string
	step?: number
}

export default function Knob(props: KnobProps) {
	const [tooltip, setTooltip] = useState(false)
	const [curPos, setCurPos] = useState([0, 0])

	useEffect(() => {
		if (!tooltip) return

		function handleDrag(e: MouseEvent) {
			setCurPos([e.clientX, e.clientY])

			const m = e.movementX
			if (m === 0) return

			let newV = props.value + m * (props.step ?? 1)

			if (newV > props.max) newV = props.max
			if (newV < props.min) newV = props.min

			props.onChange(Math.round(newV * 100) / 100)
		}

		document.body.addEventListener('mousemove', handleDrag)

		return () => {
			document.body.removeEventListener('mousemove', handleDrag)
		}
	}, [tooltip, props])

	return <div className={styles.container}>
		<svg className={styles.valueMeter} viewBox="-6.4 -6.4 12.8 12.8">
			<path
				style={{
					strokeDashoffset: `${(1 - props.value / props.max) * 230}%`
				}}
				d="M -5 4 a 6.4 6.4 0 0 1 0.5 -8.5 a 6.4 6.4 0 0 1 9 0 a 6.4 6.4 0 0 1 0.5 8.5"
			/>
		</svg>
		<div
			className={styles.knob}
			style={{
				transform: `rotate(${-140 + props.value / props.max * 280}deg)`
			}}
			onMouseDown={() => { setTooltip(true) }}
		/>
		{props.label &&
			<span>{props.label}</span>
		}

		{tooltip &&
			<div
				className={styles.tooltip}
				style={{
					left: curPos[0] - 20,
					top: curPos[1] - 15
				}}
				onMouseUp={() => { setTooltip(false) }}
			>
				<span>{props.value}</span>
			</div>
		}

	</div>
}
