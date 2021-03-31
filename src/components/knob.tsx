import type { MouseEvent as ReactMouseEvent } from 'react'
import { useState, useEffect, useCallback } from 'react'
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

	const { label, value, min, max, step, onChange } = props

	const handleDrag = useCallback((e: MouseEvent | ReactMouseEvent) => {
		setCurPos([e.clientX, e.clientY])

		const m = e.movementX
		if (m === 0) return

		let newV = value + m * (step ?? 1)

		if (newV > max) newV = max
		if (newV < min) newV = min

		onChange(Math.round(newV * 100) / 100)
	}, [onChange, value, max, min, step])


	useEffect(() => {
		if (!tooltip) return

		document.body.addEventListener('mousemove', handleDrag)

		return () => {
			document.body.removeEventListener('mousemove', handleDrag)
		}
	}, [tooltip, handleDrag])

	return <div className={styles.container}>
		<svg className={styles.valueMeter} viewBox="-6.4 -6.4 12.8 12.8">
			<path
				style={{
					strokeDashoffset: `${(1 - (props.value - props.min) / (props.max - props.min)) * 240}%`
				}}
				d="M -5 4 a 6.4 6.4 0 0 1 0.5 -8.5 a 6.4 6.4 0 0 1 9 0 a 6.4 6.4 0 0 1 0.5 8.5"
			/>
		</svg>
		<div
			className={styles.knob}
			style={{
				transform: `rotate(${-140 + (props.value - props.min) / (props.max - props.min) * 280}deg)`
			}}
			onMouseDown={e => {
				setTooltip(true)
				handleDrag(e)
			}}
		/>
		{label &&
			<span>{label}</span>
		}

		{tooltip &&
			<div
				className={styles.tooltip}
				style={{
					left: curPos[0] - 20,
					top: curPos[1] - 20
				}}
				onMouseUp={() => { setTooltip(false) }}
			>
				<span>{value}</span>
			</div>
		}

	</div>
}
