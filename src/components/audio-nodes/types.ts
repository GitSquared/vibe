export default interface AudioComponentProps {
	onNodeSpawn?: (node: AudioNode) => void
}

export interface GeneratorAudioComponentProps extends AudioComponentProps {
	out?: AudioNode
}

export interface OutputAudioComponentProps extends AudioComponentProps {
	in?: AudioNode
}

export interface ProcessorAudioComponentProps extends AudioComponentProps {
	in?: AudioNode
	out?: AudioNode
}
