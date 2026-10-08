'use client'

import { Card, CardContent } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, ColumnFiltersState, getFilteredRowModel, SortingState, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table"
import { format } from "date-fns"
import { LoaderCircle } from "lucide-react"
import { BoardAssignmentItem } from "@/lib/types"
import { deleteSlot } from "../_actions"
import { BuyAdminComponent } from "./buy-component"
import { InfoChangeComponent } from "./info-change"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination"


interface AdminTableProps {
    data: BoardAssignmentItem[]
}

export const AdminTable = ({ data }: AdminTableProps) => {
    const [selectedPosition, setSelectedPosition] = useState<BoardAssignmentItem | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDialogOpenBuy, setIsDialogOpenBuy] = useState(false)
    const [isDialogOpenInfo, setIsDialogOpenInfo] = useState(false)

    const [deleteReason, setDeleteReason] = useState("") // НОВЫЙ СТЕЙТ ДЛЯ ПРИЧИНЫ
    const [isSaving, setIsSaving] = useState(false) // СТЕЙТ ДЛЯ ЛОАДЕРА
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })

    const columns: ColumnDef<BoardAssignmentItem>[] = [
        {
            accessorKey: "userName",
            header: () => "Имя поль-ля",
            cell: ({ row }) => row.original.userName,
            enableGlobalFilter: true,
            accessorFn: row => row.userName,
            sortingFn: (a, b) => a.original.userName.localeCompare(b.original.userName),

        },
        {
            accessorKey: "userEmail",
            header: () => "Имеил поль-ля",
            cell: ({ row }) => row.original.userEmail,
            enableGlobalFilter: true,
            accessorFn: row => row.userEmail,
            sortingFn: (a, b) => a.original.userEmail.localeCompare(b.original.userEmail),
        },
        {
            accessorKey: "variant",
            header: () => "Вариант",
            cell: ({ row }) => row.original.variant,
            enableGlobalFilter: true,
            accessorFn: row => row.variant,
            sortingFn: (a, b) => a.original.variant.localeCompare(b.original.variant),
        },
        {
            accessorKey: "personalNum",
            header: () => "Номер",
            cell: ({ row }) => row.original.personalNum,
            enableGlobalFilter: true,
            accessorFn: row => row.personalNum,
            sortingFn: (a, b) => a.original.personalNum - b.original.personalNum,
        },
        {
            accessorKey: "userText",
            header: () => "Текст",
            cell: ({ row }) => {
                return <div className="max-w-sm text-pretty">{row.original.userText}</div>
            },
        },

        {
            accessorKey: "expiresAt",
            header: () => "Дата завершения",
            cell: ({ row }) => format(new Date(row.original.expiresAt), "dd.MM.yyyy, HH:mm:ss"),
            sortingFn: (a, b) => new Date(a.original.expiresAt).getTime() - new Date(b.original.expiresAt).getTime(),
        },
        {
            accessorKey: "createdAt",
            header: () => "Дата создания",
            cell: ({ row }) => format(new Date(row.original.createdAt), "dd.MM.yyyy, HH:mm:ss"),
            sortingFn: (a, b) => new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime(),
        },
        {
            accessorKey: "deletedAt",
            header: () => "Дата удаления",
            cell: ({ row }) => row.original.deletedAt ? format(new Date(row.original.deletedAt), "dd.MM.yyyy, HH:mm:ss") : null,
            sortingFn: (a, b) => {
                const dateA = a.original.deletedAt ? new Date(a.original.deletedAt).getTime() : 0;
                const dateB = b.original.deletedAt ? new Date(b.original.deletedAt).getTime() : 0;
                return dateA - dateB;
            }
        },
        {
            accessorKey: "deletedReason",
            header: () => "Причина удаления",
            cell: ({ row }) => row.original.deletedReason,
            enableGlobalFilter: true,
            accessorFn: row => row.deletedReason,
        }
    ]

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedPosition) return;

        setIsSaving(true);

        const itemId = selectedPosition.itemId;
        const variant = selectedPosition.variant;
        const reason = deleteReason.trim();

        try {
            const result = await deleteSlot(itemId, variant, reason); // Вызов Server Action

            if ("success" in result && result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message || "Неизвестная ошибка.");
            }

            setIsDialogOpen(false);
            setSelectedPosition(null);
            setDeleteReason("");

        } catch (error) {
            console.error("Error deleting slot:", error);
            toast.error("Непредвиденная ошибка на клиенте.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleOpenDialog = (item: BoardAssignmentItem) => {
        setSelectedPosition(item);
        setDeleteReason(item.deletedReason || ""); 
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedPosition(null);
        setDeleteReason("");
    }

    const table = useReactTable({
        data,
        columns: [
            ...columns,
            {
                id: "action", // Изменено id на "action"
                header: () => null,
                cell: ({ row }) => {
                    const item = row.original;
                    const isDeleted = !!item.deletedAt;
                    return <Button
                        variant="link"
                        onClick={() => handleOpenDialog(item)}
                        className={isDeleted ? "text-gray-500" : "text-red-700"}
                        disabled={isSaving}
                    >
                        {isDeleted ? "Изменить причину" : "Удалить"}
                    </Button>
                },
            }
        ],
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            columnFilters,
            globalFilter,
            pagination,
            sorting
        }
    })


    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Button
                    variant="default"
                    onClick={(e) => {
                        e.preventDefault()
                        setIsDialogOpenBuy(true)
                    }}
                    disabled={isSaving}
                >
                    Купить
                </Button>
                <Button
                    variant="secondary"
                    onClick={(e) => {
                        e.preventDefault()
                        setIsDialogOpenInfo(true)
                    }}
                    disabled={isSaving}
                >
                    Изменить информацию
                </Button>
            </div>

            <InfoChangeComponent isOpen={isDialogOpenInfo} setIsDialogOpenInfo={setIsDialogOpenInfo} />
            <BuyAdminComponent isOpen={isDialogOpenBuy} setIsDialogOpenBuy={setIsDialogOpenBuy} />
            <Card>
                <CardContent>
                    <div className='flex items-center justify-between'>
                        <Input
                            placeholder=''
                            className='md:max-w-sm'
                            value={globalFilter}
                            onChange={e => setGlobalFilter(e.currentTarget.value)}
                        />

                    </div>
                    <Table className="">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead {...header.column.columnDef.meta} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        table.previousPage();
                                    }}
                                    aria-disabled={!table.getCanPreviousPage()}
                                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            
                            {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                                <PaginationItem key={pageIndex}>
                                    <PaginationLink 
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.setPageIndex(pageIndex);
                                        }}
                                        isActive={table.getState().pagination.pageIndex === pageIndex}
                                    >
                                        {pageIndex + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                                <PaginationNext 
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        table.nextPage();
                                    }}
                                    aria-disabled={!table.getCanNextPage()}
                                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>



                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPosition?.deletedAt ? "Изменить причину удаления" : "Подтвердите удаление"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedPosition && (
                                <>
                                    Вы собираетесь удалить слот: **{selectedPosition.variant.toUpperCase()}** №{selectedPosition.personalNum} (Пользователь: {selectedPosition.userName}, Email: {selectedPosition.userEmail}).
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {/* ФОРМА С ИНПУТОМ */}
                    <form onSubmit={handleSave}>
                        <Input
                            type="text"
                            name="reason"
                            placeholder="Причина удаления (минимум 5 символов)"
                            required
                            className="mb-4"
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            minLength={5}
                            disabled={isSaving}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
                                Отмена
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <LoaderCircle size={16} className="animate-spin mr-2" /> : 'Сохранить'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}