import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
	const { currentSong, isPLaying, setCurentSong
    , togglePlay } = usePlayerStore();
	const isCurrentSong = currentSong?._id === song._id;

	const handlePlay = () => {
		if (isCurrentSong) togglePlay();
		else setCurentSong(song);
	};

	return (
		<Button
			size={"icon"}
			onClick={handlePlay}
			className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
					isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
		>
			{isCurrentSong && isPLaying ? (
				<Pause className='size-5 text-black' />
			) : (
				<Play className='size-5 text-black' />
			)}
		</Button>
	);
};
export default PlayButton;