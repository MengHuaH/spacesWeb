import React from 'react';
import { Card } from 'antd';

export default function Cards({children,type,title,extra}){
    switch (type) {
        case 'noBorder':
            return (
                <Card
                title={title}
                bordered={true}
                extra={extra}
                >
                    {children}
                </Card>
            )
        default:
            break;
    }
};
