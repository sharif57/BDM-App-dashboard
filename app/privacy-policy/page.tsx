'use client'
import { usePrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from '@/redux/feature/userSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

interface PrivacyPolicyItem {
    id: number
    title: string
    content: string
    is_active: boolean
    created_on: string
    updated_on: string
}

interface PrivacyPolicyResponse {
    status: string
    message: string
    data: PrivacyPolicyItem[]
}

export default function Privacy() {
    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = usePrivacyPolicyQuery(undefined) as {
        data?: PrivacyPolicyResponse
        isLoading: boolean
        isFetching: boolean
        isError: boolean
        refetch: () => void
    }

    const [updatePrivacyPolicy, { isLoading: isSaving }] = useUpdatePrivacyPolicyMutation()
    const [content, setContent] = useState('')

    const policy = useMemo(() => data?.data?.[0], [data])

    useEffect(() => {
        if (policy?.content !== undefined) {
            setContent(policy.content)
        }
    }, [policy?.content])

    const handleUpdate = async () => {
        if (!policy?.id) {
            toast.error('No privacy policy found to update')
            return
        }

        try {
            await updatePrivacyPolicy({
                id: policy.id,
                data: { content },
            }).unwrap()
            toast.success('Privacy policy updated successfully')
            refetch()
        } catch {
            toast.error('Failed to update privacy policy')
        }
    }

    const isUnchanged = (policy?.content ?? '') === content

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl p-6 md:p-8">
                <Card className="border-slate-700/60 bg-slate-900/40">
                    <CardHeader>
                        <CardTitle className="text-2xl">Privacy Policy</CardTitle>
                        <CardDescription>Loading policy content...</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 animate-pulse rounded-lg bg-slate-800/70" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="mx-auto w-full max-w-4xl p-6 md:p-8">
                <Card className="border-red-500/40 bg-red-500/10">
                    <CardHeader>
                        <CardTitle className="text-2xl text-red-300">Could not load privacy policy</CardTitle>
                        <CardDescription className="text-red-200/90">
                            Please check your network connection and try again.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => refetch()} className="bg-red-500 text-white hover:bg-red-600">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-120px)] px-4 py-8 md:px-8">
            <div className="mx-auto w-full max-w-5xl">
                <Card className="border-slate-700/60 bg-slate-900/70 shadow-2xl backdrop-blur">
                    <CardHeader className="space-y-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <CardTitle className="text-3xl font-bold text-slate-100">Privacy Policy Editor</CardTitle>
                            <span className="inline-flex w-fit items-center rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                                {policy?.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <CardDescription className="text-slate-300">
                            Keep your policy up to date. Changes are saved directly to your server.
                        </CardDescription>
                        {policy?.updated_on && (
                            <p className="text-xs text-slate-400">
                                Last updated: {new Date(policy.updated_on).toLocaleString()}
                            </p>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 p-4">
                            <label htmlFor="privacy-content" className="mb-2 block text-sm font-medium text-slate-200">
                                Policy Content
                            </label>
                            <Textarea
                                id="privacy-content"
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                placeholder="Write your privacy policy content here..."
                                className="min-h-[320px] border-slate-700 bg-slate-900/90 text-slate-100 placeholder:text-slate-500"
                            />
                            <p className="mt-2 text-xs text-slate-400">Character count: {content.length}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                {isFetching ? 'Refreshing latest version...' : 'All changes are synced after save.'}
                            </p>
                            <Button
                                onClick={handleUpdate}
                                disabled={isSaving || isUnchanged || !content.trim()}
                                className="min-w-32 bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
