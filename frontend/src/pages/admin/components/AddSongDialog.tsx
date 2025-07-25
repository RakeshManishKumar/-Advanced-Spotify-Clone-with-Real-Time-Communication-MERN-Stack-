import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Upload, Music, Image, X, CheckCircle, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
	title: string;
	artist: string;
	album: string;
	duration: string;
}

const AddSongDialog = () => {
	const { album, fetchSongs } = useMusicStore();
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		artist: "",
		album: "",
		duration: "0",
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!newSong.title.trim()) {
			newErrors.title = "Title is required";
		}
		if (!newSong.artist.trim()) {
			newErrors.artist = "Artist is required";
		}
		if (!files.audio) {
			newErrors.audio = "Audio file is required";
		}
		if (!files.image) {
			newErrors.image = "Image file is required";
		}
		if (!newSong.duration || parseInt(newSong.duration) <= 0) {
			newErrors.duration = "Duration must be greater than 0";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			toast.error("Please fix the errors before submitting");
			return;
		}

		setIsLoading(true);

		try {
			const formData = new FormData();

			formData.append("title", newSong.title.trim());
			formData.append("artist", newSong.artist.trim());
			formData.append("duration", newSong.duration);
			if (newSong.album && newSong.album !== "none") {
				formData.append("albumId", newSong.album);
			}

			formData.append("audioFile", files.audio!);
			formData.append("imageFile", files.image!);

			await axiosInstance.post("/api/admin/songs", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// Reset form
			setNewSong({
				title: "",
				artist: "",
				album: "",
				duration: "0",
			});

			setFiles({
				audio: null,
				image: null,
			});

			setErrors({});
			setSongDialogOpen(false);
			
			// Refresh songs list
			await fetchSongs();
			
			toast.success("Song added successfully!");
		} catch (error: unknown) {
			console.error("Error adding song:", error);
			const errorMessage = error instanceof Error ? error.message : "Failed to add song";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileSelect = (type: 'audio' | 'image', file: File | null) => {
		setFiles(prev => ({ ...prev, [type]: file }));
		// Clear error when file is selected
		if (file) {
			setErrors(prev => ({ ...prev, [type]: "" }));
		}
	};

	const formatDuration = (seconds: string) => {
		const secs = parseInt(seconds);
		const minutes = Math.floor(secs / 60);
		const remainingSeconds = secs % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-200'>
					<Plus className='mr-2 h-4 w-4' />
					Add Song
				</Button>
			</DialogTrigger>

			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[90vh] overflow-auto w-[500px] max-w-[95vw]'>
				<DialogHeader className='space-y-3'>
					<DialogTitle className='text-xl font-semibold text-white'>Add New Song</DialogTitle>
					<DialogDescription className='text-zinc-400'>
						Upload a new song to your music library. All fields marked with * are required.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 py-4'>
					{/* File Upload Section */}
					<div className='space-y-4'>
						<h3 className='text-sm font-medium text-zinc-300 mb-3'>Upload Files *</h3>
						
						{/* Image Upload */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-zinc-300 flex items-center gap-2'>
								<Image className='h-4 w-4' />
								Cover Art
							</label>
							<input
								type='file'
								ref={imageInputRef}
								className='hidden'
								accept='image/*'
								onChange={(e) => handleFileSelect('image', e.target.files?.[0] || null)}
							/>
							<div
								className={`relative group cursor-pointer transition-all duration-200 ${
									files.image 
										? 'border-emerald-500 bg-emerald-500/10' 
										: 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
								} border-2 border-dashed rounded-lg p-6 text-center`}
								onClick={() => imageInputRef.current?.click()}
							>
								{files.image ? (
									<div className='space-y-3'>
										<div className='flex items-center justify-center'>
											<CheckCircle className='h-8 w-8 text-emerald-500' />
										</div>
										<div className='space-y-1'>
											<p className='text-sm font-medium text-white'>{files.image.name}</p>
											<p className='text-xs text-zinc-400'>{formatFileSize(files.image.size)}</p>
										</div>
										<Button
											variant='ghost'
											size='sm'
											className='text-xs text-zinc-400 hover:text-white'
											onClick={(e) => {
												e.stopPropagation();
												handleFileSelect('image', null);
											}}
										>
											<X className='h-3 w-3 mr-1' />
											Remove
										</Button>
									</div>
								) : (
									<div className='space-y-3'>
										<div className='flex items-center justify-center'>
											<Upload className='h-8 w-8 text-zinc-400 group-hover:text-zinc-300' />
										</div>
										<div className='space-y-1'>
											<p className='text-sm font-medium text-zinc-300'>Upload cover art</p>
											<p className='text-xs text-zinc-500'>PNG, JPG up to 10MB</p>
										</div>
									</div>
								)}
							</div>
							{errors.image && (
								<p className='text-xs text-red-400 flex items-center gap-1'>
									<AlertCircle className='h-3 w-3' />
									{errors.image}
								</p>
							)}
						</div>

						{/* Audio Upload */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-zinc-300 flex items-center gap-2'>
								<Music className='h-4 w-4' />
								Audio File
							</label>
							<input
								type='file'
								accept='audio/*'
								ref={audioInputRef}
								className='hidden'
								onChange={(e) => handleFileSelect('audio', e.target.files?.[0] || null)}
							/>
							<div
								className={`relative group cursor-pointer transition-all duration-200 ${
									files.audio 
										? 'border-emerald-500 bg-emerald-500/10' 
										: 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
								} border-2 border-dashed rounded-lg p-6 text-center`}
								onClick={() => audioInputRef.current?.click()}
							>
								{files.audio ? (
									<div className='space-y-3'>
										<div className='flex items-center justify-center'>
											<CheckCircle className='h-8 w-8 text-emerald-500' />
										</div>
										<div className='space-y-1'>
											<p className='text-sm font-medium text-white'>{files.audio.name}</p>
											<p className='text-xs text-zinc-400'>{formatFileSize(files.audio.size)}</p>
										</div>
										<Button
											variant='ghost'
											size='sm'
											className='text-xs text-zinc-400 hover:text-white'
											onClick={(e) => {
												e.stopPropagation();
												handleFileSelect('audio', null);
											}}
										>
											<X className='h-3 w-3 mr-1' />
											Remove
										</Button>
									</div>
								) : (
									<div className='space-y-3'>
										<div className='flex items-center justify-center'>
											<Music className='h-8 w-8 text-zinc-400 group-hover:text-zinc-300' />
										</div>
										<div className='space-y-1'>
											<p className='text-sm font-medium text-zinc-300'>Upload audio file</p>
											<p className='text-xs text-zinc-500'>MP3, WAV up to 50MB</p>
										</div>
									</div>
								)}
							</div>
							{errors.audio && (
								<p className='text-xs text-red-400 flex items-center gap-1'>
									<AlertCircle className='h-3 w-3' />
									{errors.audio}
								</p>
							)}
						</div>
					</div>

					{/* Song Details Section */}
					<div className='space-y-5'>
						<h3 className='text-sm font-medium text-zinc-300 mb-3'>Song Details</h3>
						
						<div className='grid grid-cols-2 gap-5'>
							<div className='space-y-3'>
								<label className='text-sm font-medium text-zinc-300 pb-2 block'>Title *</label>
								<Input
									value={newSong.title}
									onChange={(e) => {
										setNewSong({ ...newSong, title: e.target.value });
										if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
									}}
									className={`bg-zinc-800 border-zinc-700 focus:border-emerald-500 ${
										errors.title ? 'border-red-500' : ''
									}`}
									placeholder='Enter song title'
								/>
								{errors.title && (
									<p className='text-xs text-red-400 flex items-center gap-1'>
										<AlertCircle className='h-3 w-3' />
										{errors.title}
									</p>
								)}
							</div>

							<div className='space-y-3'>
								<label className='text-sm font-medium text-zinc-300 pb-2 block'>Artist *</label>
								<Input
									value={newSong.artist}
									onChange={(e) => {
										setNewSong({ ...newSong, artist: e.target.value });
										if (errors.artist) setErrors(prev => ({ ...prev, artist: "" }));
									}}
									className={`bg-zinc-800 border-zinc-700 focus:border-emerald-500 ${
										errors.artist ? 'border-red-500' : ''
									}`}
									placeholder='Enter artist name'
								/>
								{errors.artist && (
									<p className='text-xs text-red-400 flex items-center gap-1'>
										<AlertCircle className='h-3 w-3' />
										{errors.artist}
									</p>
								)}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-5'>
							<div className='space-y-3'>
								<label className='text-sm font-medium text-zinc-300 pb-2 block'>Duration (seconds) *</label>
								<Input
									type='number'
									min='1'
									value={newSong.duration}
									onChange={(e) => {
										setNewSong({ ...newSong, duration: e.target.value });
										if (errors.duration) setErrors(prev => ({ ...prev, duration: "" }));
									}}
									className={`bg-zinc-800 border-zinc-700 focus:border-emerald-500 ${
										errors.duration ? 'border-red-500' : ''
									}`}
									placeholder='0'
								/>
								{newSong.duration && parseInt(newSong.duration) > 0 && (
									<p className='text-xs text-zinc-400 my-2'>
										Duration: {formatDuration(newSong.duration)}
									</p>
								)}
								{errors.duration && (
									<p className='text-xs text-red-400 flex items-center gap-1'>
										<AlertCircle className='h-3 w-3' />
										{errors.duration}
									</p>
								)}
							</div>

							<div className='space-y-3'>
								<label className='text-sm font-medium text-zinc-300 pb-2 block'>Album (Optional)</label>
								<Select
									value={newSong.album}
									onValueChange={(value) => setNewSong({ ...newSong, album: value })}
								>
									<SelectTrigger className='bg-zinc-800 border-zinc-700 focus:border-emerald-500'>
										<SelectValue placeholder='Select album' />
									</SelectTrigger>
									<SelectContent className='bg-zinc-800 border-zinc-700'>
										<SelectItem value='none'>No Album (Single)</SelectItem>
										{album.map((album) => (
											<SelectItem key={album._id} value={album._id}>
												{album.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className='space-x-3'>
					<Button 
						variant='outline' 
						onClick={() => setSongDialogOpen(false)} 
						disabled={isLoading}
						className='border-zinc-700 text-zinc-300 hover:bg-zinc-800'
					>
						Cancel
					</Button>
					<Button 
						onClick={handleSubmit} 
						disabled={isLoading}
						className='bg-emerald-500 hover:bg-emerald-600 text-white'
					>
						{isLoading ? (
							<>
								<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
								Uploading...
							</>
						) : (
							'Add Song'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddSongDialog;
