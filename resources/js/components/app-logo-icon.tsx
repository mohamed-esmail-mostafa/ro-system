import useSetting from '@/hooks/use-setting';
import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const { settings } = useSetting()


    return (
        <div className=''>
            <img
                className=" border rounded-md"
              
                loading="lazy"
                src={settings?.app_logo ?? undefined}
                alt={settings?.app_name_ar}
            />
        </div>
    );
}
