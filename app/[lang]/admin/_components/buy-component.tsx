'use client';

import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Variant } from "@/lib/types";

import { RefreshCcw, Star } from "lucide-react";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { createHoldsAndSlot } from "../_actions";
import { toast } from "sonner";

interface BuyAdminComponentProps {
	isOpen: boolean
	setIsDialogOpenBuy: Dispatch<SetStateAction<boolean>>
}

export const BuyAdminComponent = ({ isOpen, setIsDialogOpenBuy }: BuyAdminComponentProps) => {

	const [pending, startTransition] = useTransition()

	const [variantType, setVariantType] = useState<Variant>("money");
	const [text, setText] = useState('');
	const [days, setDays] = useState(1);
	const [isPreferNumber, setIsPreferNumber] = useState(false);
	const [preferredNumber, setPreferredNumber] = useState(1);

	const handleSubmit = async () => {
		startTransition(async () => {
			const slot = {
				variant: variantType,
				text: text,
				days: days > 0 ? days : 1,
				personalNum: isPreferNumber ? preferredNumber : undefined,
			}
			// The cell goes to the signed-in admin (taken from the session on the server)
			const res = await createHoldsAndSlot(slot);
			if ("message" in res) {
				toast.error(`Ошибка: ${res.message}`);
			} else {
				toast.success(`Успешно куплено: ${res.variant} слот`);
				setText('');
				setDays(0);
				setPreferredNumber(1);
				setIsPreferNumber(false);
				setVariantType("money");
				setIsDialogOpenBuy(false);
			}
		})
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsDialogOpenBuy}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Купить ячейки
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<Button
								variant={variantType === "money" ? "default" : "outline"}
								onClick={() => setVariantType("money")}
								disabled={pending}
							>
								money
							</Button>
							<Button
								variant={variantType === "love" ? "default" : "outline"}
								onClick={() => setVariantType("love")}
								disabled={pending}
							>
								love
							</Button>
							<Button
								variant={variantType === "luck" ? "default" : "outline"}
								onClick={() => setVariantType("luck")}
								disabled={pending}
							>
								luck
							</Button>
							<Button
								variant={variantType === "soul" ? "default" : "outline"}
								onClick={() => setVariantType("soul")}
								disabled={pending}
							>
								soul
							</Button>
							<Button
								variant={variantType === "dream" ? "default" : "outline"}
								onClick={() => setVariantType("dream")}
								disabled={pending}
							>
								dream
							</Button>
						</div>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<>
							<Textarea
								disabled={pending}
								value={text}
								onChange={(e) => setText((e.target.value || '').slice(0, 160))}
								placeholder={'Пожелание / намерение'}
								maxLength={160}
								className={``}
							/>
							<Input
								disabled={pending}
								inputMode="numeric"
								type="number"
								min={1}
								value={days || ''}
								onChange={(e) => setDays(Number(e.target.value))}
								placeholder="Количество дней"
							/>
							
							<Button
								type="button"
								variant="ghost"
								disabled={pending}
								size="sm"
								onClick={() => setIsPreferNumber(!isPreferNumber)}
								className="cursor-pointer text-xs text-foreground"
							>
								<Label className="text-end text-wrap cursor-pointer text-xs text-muted-foreground">
									{isPreferNumber ? <RefreshCcw /> : <Star />}
								</Label>
							</Button>
							{isPreferNumber && (
								<Input
									disabled={pending}
									inputMode="numeric"
									type="number"
									min={1}
									value={preferredNumber}
									onChange={(e) => setPreferredNumber(Number(e.target.value))}
									placeholder="Предпочитаемый номер"
								/>
							)}
						
						</>
					</div>
				<DialogFooter>
					<Button
						onClick={handleSubmit}
						disabled={pending}
					>
						Купить
					</Button>
				</DialogFooter>
					
			</DialogContent>

		</Dialog>
	);
}