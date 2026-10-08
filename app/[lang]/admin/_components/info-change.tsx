'use client';

import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { toast } from "sonner";
import { createInfo } from "../_actions";

interface InfoChangeComponentProps {
	isOpen: boolean
	setIsDialogOpenInfo: Dispatch<SetStateAction<boolean>>
}

export const InfoChangeComponent = ({ isOpen, setIsDialogOpenInfo }: InfoChangeComponentProps) => {

	const [pending, startTransition] = useTransition()
	const [nextBroadcast, setNextBroadcast] = useState('');
	const [prevBroadcast, setPrevBroadcast] = useState('');
	const [weekTopic, setWeekTopic] = useState('');

	const handleSubmit = async () => {
		startTransition(async () => {
			const res = await createInfo({
				nextBroadcast,
				prevBroadcast,
				weekTopic
			});
			if ("message" in res) {
				toast.error(`Ошибка: ${res.message}`);
			} else {
				setIsDialogOpenInfo(false);
				toast.success(`Информация успешно обновлена`);
				setNextBroadcast('');
				setPrevBroadcast('');
				setWeekTopic('');
			}
		})
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsDialogOpenInfo}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Изменить информацию
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex flex-col gap-2">
						<Label>Следующий эфир</Label>
						<Input
							disabled={pending}
							value={nextBroadcast}
							onChange={(e) => setNextBroadcast(e.target.value)}
							placeholder={'Следующий эфир'}
							className={``}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>Предыдущий эфир</Label>
						<Input
							disabled={pending}
							value={prevBroadcast}
							onChange={(e) => setPrevBroadcast(e.target.value)}
							placeholder={'Предыдущий эфир'}
							className={``}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>Тема недели</Label>
						<Textarea
							disabled={pending}
							value={weekTopic}
							onChange={(e) => setWeekTopic(e.target.value)}
							placeholder={'Тема недели'}
							className={``}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={handleSubmit}
					>
						Сохранить
					</Button>
				</DialogFooter>
			</DialogContent>

		</Dialog>
	);
}