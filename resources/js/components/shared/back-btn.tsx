import React from 'react'
import { Button } from '../ui/button'
import { ForwardIcon } from 'lucide-react'
import useImport from '@/hooks/use-import'

export default function BackBtn() {
    const {t}=useImport()
  return (
    <Button onClick={()=>history.back()}>
        <ForwardIcon />
        {t("common.back")}
    </Button>
  )
}
