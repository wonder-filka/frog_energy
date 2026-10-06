'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoaderCircle, RotateCcw, ClockArrowUp, ClockArrowDown } from 'lucide-react'

import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { cn } from '@/lib/utils'
import { VARIANT_STYLES } from '@/lib/constants'
import type { Assignment, Variant } from '@/lib/types'
import type { BoardDict } from '../_dict'
import type { Locale } from '@/i18n-config'

import { Pagination } from './pagination-dashboard'
import { TakenCellCard } from './taken-cell-card'
import { FreeCellButton } from './free-cell-button'
import '../boards.css'

export interface DashboardProps {
  userId?: string | null
  assignments: Assignment[]
  variant: Variant
  t: BoardDict
  locale: Locale
}

type SortMode = 'default' | 'newest' | 'oldest'

const TOTAL_PAGES = 10
const TOTAL_CELLS = 10_000
const BASE_PAGE_SIZE = Math.max(1, Math.ceil(TOTAL_CELLS / TOTAL_PAGES))
const ALL_CELLS: number[] = Array.from({ length: TOTAL_CELLS }, (_, i) => i + 1)


function getPageForCell(cellNumber: number): number {
  const candidate = Math.ceil(cellNumber / BASE_PAGE_SIZE)
  if (!Number.isFinite(candidate)) return 1
  return Math.max(1, Math.min(TOTAL_PAGES, candidate))
}

function getCreatedAtMs(assignment: Assignment): number {
  return assignment?.createdAt ? new Date(assignment.createdAt).getTime() : 0
}

function clearSearchNumParam(): void {
  if (typeof window === 'undefined') return
  
  const url = new URL(window.location.href)
  url.searchParams.delete('searchNum')
  const queryString = url.search ? `?${url.searchParams.toString()}` : ''
  window.history.replaceState(null, '', `${url.pathname}${queryString}${url.hash}`)
}

export const DashboardComponents = ({ userId, assignments, variant, t, locale }: DashboardProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const styles = VARIANT_STYLES[variant]

  const [sort, setSort] = useState<SortMode>('default')
  const [query, setQuery] = useState('')
  const searchNum = searchParams.get('searchNum')
  const searchNumValue = Number(searchNum)
  const isSearchNum = Boolean(searchNum && searchNumValue > 0)

  const [page, setPage] = useState<number>(() => (isSearchNum ? getPageForCell(searchNumValue) : 1))

  // ?searchNum= can change while the board stays mounted: adjust state during render, not in an effect
  const [prevSearchNum, setPrevSearchNum] = useState(searchNum)
  if (searchNum !== prevSearchNum) {
    setPrevSearchNum(searchNum)
    setPage(isSearchNum ? getPageForCell(searchNumValue) : 1)
  }


  const byCell = useMemo(() => {
    const map = new Map<number, Assignment>()
    for (const assignment of assignments) {
      map.set(assignment.personalNum, assignment)
    }
    return map
  }, [assignments])

  const newestOrder = useMemo(() => {
    const taken = assignments.filter((a) => a?.createdAt != null)
    const takenSorted = [...taken].sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a))
    
    const seen = new Set<number>()
    const takenUnique: number[] = []
    
    for (const assignment of takenSorted) {
      if (!seen.has(assignment.personalNum)) {
        seen.add(assignment.personalNum)
        takenUnique.push(assignment.personalNum)
      }
    }
    
    const rest = ALL_CELLS.filter((n) => !seen.has(n))
    return [...takenUnique, ...rest]
  }, [assignments])

  const oldestOrder = useMemo(() => {
    const taken = assignments.filter((a) => a?.createdAt != null)
    const takenSortedAsc = [...taken].sort((a, b) => getCreatedAtMs(a) - getCreatedAtMs(b))
    
    const seen = new Set<number>()
    const takenUnique: number[] = []
    
    for (const assignment of takenSortedAsc) {
      if (!seen.has(assignment.personalNum)) {
        seen.add(assignment.personalNum)
        takenUnique.push(assignment.personalNum)
      }
    }
    
    const rest = ALL_CELLS.filter((n) => !seen.has(n))
    return [...takenUnique, ...rest]
  }, [assignments])

  const ordered = useMemo(() => {
    if (sort === 'newest') return newestOrder
    if (sort === 'oldest') return oldestOrder
    return ALL_CELLS
  }, [sort, newestOrder, oldestOrder])

  const isSearching = query.trim().length > 0

  const filteredCells = useMemo(() => {
    if (!query.trim()) return ordered

    const trimmed = query.trim()

    if (query.endsWith(' ')) {
      const num = parseInt(trimmed, 10)
      if (!Number.isNaN(num)) return ordered.filter((n) => n === num)
    }

    return ordered.filter((n) => {
      const assignment = byCell.get(n)
      const numberMatch = n.toString().includes(trimmed)
      const text = `${assignment?.userName ?? ''} ${assignment?.userText ?? ''}`.toLowerCase()
      const textMatch = text.includes(trimmed.toLowerCase())
      return numberMatch || textMatch
    })
  }, [ordered, byCell, query])

  const pageSize = isSearching ? Math.max(1, filteredCells.length) : BASE_PAGE_SIZE
  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(filteredCells.length / BASE_PAGE_SIZE))

  const pagedCells = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredCells.slice(start, end)
  }, [filteredCells, page, pageSize])

  // Scroll to the ?searchNum= cell once its page is rendered
  useEffect(() => {
    if (!isSearchNum) return
    document.getElementById(`cell-${searchNumValue}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [isSearchNum, searchNumValue, page])


  const handleOpenBuy = useCallback(
    (cellNumber: number) => {
      router.push(`/${locale}/buy?variant=${variant}&number=${cellNumber}`)
    },
    [router, variant, locale]
  )

  const handlePrevPage = useCallback(() => {
    setPage((prevPage) => Math.max(1, prevPage - 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setPage((prevPage) => Math.min(totalPages, prevPage + 1))
  }, [totalPages])

  const handleGoToPage = useCallback((targetPage: number) => {
    setPage(targetPage)
  }, [])

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSearchNum) clearSearchNumParam()
    setQuery(event.target.value)
    setPage(1)
  }, [isSearchNum])

  const handleSortNewest = useCallback(() => {
    if (isSearchNum) clearSearchNumParam()
    setSort('newest')
    setPage(1)
  }, [isSearchNum])

  const handleSortOldest = useCallback(() => {
    if (isSearchNum) clearSearchNumParam()
    setSort('oldest')
    setPage(1)
  }, [isSearchNum])

  const handleResetSort = useCallback(() => {
    if (isSearchNum) clearSearchNumParam()
    setQuery('')
    setSort('default')
    setPage(1)
  }, [isSearchNum])

  const handleCreateNewCell = useCallback(() => {
    router.push(`/${locale}/buy`)
  }, [router, locale])

  const renderEmptyState = () => {
    if (isSearching && filteredCells.length === 0) {
      return (
        <div className="flex justify-center items-center space-x-2 w-full min-h-64 col-span-2 xl:col-span-5">
          {t.noResult}
        </div>
      )
    }

    if (pagedCells.length === 0) {
      return (
        <div className="flex justify-center items-center space-x-2 w-full min-h-100 col-span-2 xl:col-span-5">
          <LoaderCircle size={25} className={cn('animate-spin', styles.text)} />
        </div>
      )
    }

    return null
  }

  const renderCells = () => {
    return pagedCells.map((cellNumber) => {
      const assignment = byCell.get(cellNumber)
      const isMine = assignment?.userId === userId
      const isTaken = Boolean(assignment)

      if (isTaken && assignment) {
        return (
          <TakenCellCard
            key={cellNumber}
            n={cellNumber}
            a={assignment}
            isMine={!!isMine}
            styles={styles}
            userId={userId}
            variant={variant}
            t={t}
            locale={locale}
          />
        )
      }

      return (
        <FreeCellButton
          key={cellNumber}
          n={cellNumber}
          arrKey={styles.arrKey ?? ''}
          onClick={handleOpenBuy}
        />
      )
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">
            {t.title}
          </h1>
          <h2 className="font-semibold text-muted-foreground text-md">
            {t.description}
          </h2>
        </div>

        <Button onClick={handleCreateNewCell} className={styles.buttonTitle}>
          {t.newCell}
        </Button>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-start">
        <Input
          type="search"
          placeholder={t.search}
          value={query}
          onChange={handleSearchChange}
          className={cn('max-w-sm', styles.focusV)}
          aria-label="Search cells"
        />

        <div className="flex items-center gap-2" role="group" aria-label="Sort options">
          <Button
            type="button"
            variant={sort === 'newest' ? 'default' : 'outline'}
            className={cn('h-9', sort === 'newest' ? cn('text-black', styles.sort1) : styles.sort2)}
            onClick={handleSortNewest}
            aria-label="Sort by newest"
          >
            <ClockArrowUp className="mr-1 h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant={sort === 'oldest' ? 'default' : 'outline'}
            className={cn('h-9', sort === 'oldest' ? cn('text-black', styles.sort1) : styles.sort2)}
            onClick={handleSortOldest}
            aria-label="Sort by oldest"
          >
            <ClockArrowDown className="mr-1 h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant={sort === 'default' ? 'default' : 'outline'}
            className={cn('h-9', sort === 'default' ? cn('text-black', styles.sort1) : styles.sort2)}
            onClick={handleResetSort}
            aria-label="Reset filters"
          >
            <RotateCcw className="mr-1 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Pagination Top */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        onGo={handleGoToPage}
        activeClass={styles.sortArr}
        outlineClass={styles.sort2}
      />

      {/* Cells Grid */}
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {renderEmptyState() || renderCells()}

      </div>

      {/* Pagination Bottom */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        onGo={handleGoToPage}
        activeClass={styles.items}
        outlineClass={styles.sort2}
      />
    </div>
  )
}
