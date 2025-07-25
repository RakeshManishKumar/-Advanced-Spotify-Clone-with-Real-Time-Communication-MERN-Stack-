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
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
	const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [newAlbum, setNewAlbum] = useState({
		title: "",
		artist: "",
		releaseYear: new Date().getFullYear(),
	});

	const [imageFile, setImageFile] = useState<File | null>(null);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!imageFile) {
				return toast.error("Please upload an image");
			}

			const formData = new FormData();
			formData.append("title", newAlbum.title);
			formData.append("artist", newAlbum.artist);
			formData.append("releaseYear", newAlbum.releaseYear.toString());
			formData.append("imageFile", imageFile);

			await axiosInstance.post("/api/admin/album", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setNewAlbum({
				title: "",
				artist: "",
				releaseYear: new Date().getFullYear(),
			});
			setImageFile(null);
			setAlbumDialogOpen(false);
			toast.success("Album created successfully");
		} catch (error) {
      console.log(error)
			toast.error("Failed to create album: " + (error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-violet-500 hover:bg-violet-600 text-white shadow-lg hover:shadow-violet-500/25 transition-all duration-200'>
					<Plus className='mr-2 h-4 w-4' />
					Add Album
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[90vh] overflow-auto w-[500px] max-w-[95vw]'>
				<DialogHeader className='space-y-3'>
					<DialogTitle className='text-xl font-semibold text-white'>Add New Album</DialogTitle>
					<DialogDescription className='text-zinc-400'>
						Create a new album to organize your music collection. All fields are required.
					</DialogDescription>
				</DialogHeader>
				<div className='space-y-6 py-4'>
					{/* Image Upload Section */}
					<div className='space-y-4'>
						<h3 className='text-sm font-medium text-zinc-300 mb-3'>Album Artwork *</h3>
						<input
							type='file'
							ref={fileInputRef}
							onChange={handleImageSelect}
							accept='image/*'
							className='hidden'
						/>
						<div
							className={`relative group cursor-pointer transition-all duration-200 ${
								imageFile 
									? 'border-violet-500 bg-violet-500/10' 
									: 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
							} border-2 border-dashed rounded-lg p-8 text-center`}
							onClick={() => fileInputRef.current?.click()}
						>
							<div className='space-y-4'>
								<div className='flex items-center justify-center'>
									<div className={`p-4 rounded-full ${
										imageFile ? 'bg-violet-500/20' : 'bg-zinc-800'
									}`}>
										<Upload className={`h-8 w-8 ${
											imageFile ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-300'
										}`} />
									</div>
								</div>
								<div className='space-y-2'>
									<p className='text-sm font-medium text-zinc-300'>
										{imageFile ? imageFile.name : "Upload album artwork"}
									</p>
									<p className='text-xs text-zinc-500'>
										{imageFile ? "File selected" : "PNG, JPG up to 10MB"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Album Details Section */}
					<div className='space-y-5'>
						<h3 className='text-sm font-medium text-zinc-300 mb-4'>Album Details</h3>
						
						<div className='grid grid-cols-2 gap-5'>
							<div className='space-y-3'>
								<label className='text-sm font-medium text-zinc-300 pb-2 block'>Album Title *</label>
								<Input
									value={newAlbum.title}
									onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
									className='bg-zinc-800 border-zinc-700 focus:border-violet-500 focus:ring-violet-500/20'
									placeholder='Enter album title'
								/>
							</div>

							<div className='space-y-3'>
								<label className='text-sm font-medium text-zinc-300 pb-2 block'>Artist *</label>
								<Input
									value={newAlbum.artist}
									onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
									className='bg-zinc-800 border-zinc-700 focus:border-violet-500 focus:ring-violet-500/20'
									placeholder='Enter artist name'
								/>
							</div>
						</div>

						<div className='space-y-3'>
							<label className='text-sm font-medium text-zinc-300 pb-2 block'>Release Year *</label>
							<Input
								type='number'
								value={newAlbum.releaseYear}
								onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
								className='bg-zinc-800 border-zinc-700 focus:border-violet-500 focus:ring-violet-500/20 w-full'
								placeholder='Enter release year'
								min={1900}
								max={new Date().getFullYear()}
							/>
						</div>
					</div>
				</div>
				<DialogFooter className='space-x-3'>
					<Button 
						variant='outline' 
						onClick={() => setAlbumDialogOpen(false)} 
						disabled={isLoading}
						className='border-zinc-700 text-zinc-300 hover:bg-zinc-800'
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-violet-500 hover:bg-violet-600 text-white shadow-lg hover:shadow-violet-500/25'
						disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}
					>
						{isLoading ? (
							<>
								<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
								Creating...
							</>
						) : (
							'Add Album'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddAlbumDialog;