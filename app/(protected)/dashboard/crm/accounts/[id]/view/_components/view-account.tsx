import Link from "next/link"

import { getAccounts, getAccountById } from "@/actions/account"
import { getLeads } from "@/actions/lead"
import PageWrapper from "@/app/(protected)/_components/page-wrapper"
import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { Card } from "@/components/ui/card"
import { cn, getInitials } from "@/lib/utils"
import AccountSummaryTab from "./tabs/account-summary-tab"
import AccountContactsTab from "./tabs/account-contacts-tab"
import AccountLeadsTab from "./tabs/account-leads-tab"
import { getContacts } from "@/actions/contacts"

type ViewAccountProps = {
  account: NonNullable<Awaited<ReturnType<typeof getAccountById>>>
  accounts: Awaited<ReturnType<typeof getAccounts>>
  leads: Awaited<ReturnType<typeof getLeads>>
  contacts: Awaited<ReturnType<typeof getContacts>>
}

export default function ViewAccount({ account, accounts, contacts, leads }: ViewAccountProps) {
  const STATUS_CLASSES: Record<string, string> = {
    green: "bg-green-50 text-green-600 ring-green-500/10",
    red: "bg-red-50 text-red-600 ring-red-500/10",
  }

  return (
    <PageWrapper
      title='Account Details'
      description='View the comprehensive details of this account.'
      actions={
        <div className='flex items-center gap-2'>
          <Link className={buttonVariants({ variant: "outline-primary" })} href={`/dashboard/crm/accounts`}>
            Back
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='default' size='icon'>
                <Icons.moreVertical className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/crm/accounts/${account.id}`}>
                  <Icons.pencil className='mr-2 size-4' /> Edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      <div className='flex flex-col gap-4'>
        <Card className='flex items-center rounded-lg p-6 shadow-md'>
          <div className='flex items-center gap-2'>
            <div className='flex size-12 items-center justify-center rounded-full bg-muted font-bold'>{getInitials(account.name)}</div>
            <div className='flex flex-col'>
              <h1 className='mb-0 text-sm font-semibold'>{account.name}</h1>
              <div className='flex items-center gap-2'>
                {account.email && (
                  <div className='flex items-center gap-1'>
                    <Icons.mail className='size-4 text-muted-foreground/75' />
                    <Link href={`mailto:${account.email}`} className='text-sm text-muted-foreground/75 decoration-1 hover:underline'>
                      {account.email}
                    </Link>
                  </div>
                )}

                {account.phone && (
                  <div className='flex items-center gap-1'>
                    <Icons.phone className='size-4 text-muted-foreground/75' />
                    <Link href={`tel:${account.email}`} className='text-sm text-muted-foreground/75 decoration-1 hover:underline'>
                      {account.phone}
                    </Link>
                  </div>
                )}

                <span
                  className={cn(
                    `inline-flex items-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1`,
                    account.isActive ? STATUS_CLASSES["green"] : STATUS_CLASSES["red"]
                  )}
                >
                  {account.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue='1' className='w-full'>
          <TabsList className='mb-2'>
            <TabsTrigger value='1'>Summary</TabsTrigger>
            <TabsTrigger value='2'>Contacts</TabsTrigger>
            <TabsTrigger value='3'>Leads</TabsTrigger>
          </TabsList>

          <TabsContent value='1'>
            <AccountSummaryTab account={account} />
          </TabsContent>

          <TabsContent value='2'>
            <AccountContactsTab account={account} accounts={accounts} leads={leads} />
          </TabsContent>

          <TabsContent value='3'>
            <AccountLeadsTab account={account} accounts={accounts} contacts={contacts} leads={leads} />
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  )
}
