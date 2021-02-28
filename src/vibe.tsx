import Synth from 'components/synth'
import styles from './vibe.module.scss'

export default function Vibe() {
	return <div className={styles.container}>
		<h1 className={styles.title}>
			<strong>VIBE</strong>
		</h1>
		<Synth/>
	</div>
}
