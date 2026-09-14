import type { OrderItem } from '@/data/order-store'

export function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => (
        <li key={item.id} className="text-sm text-stone-600">
          <span className="font-semibold text-stone-800">{item.quantity}×</span> {item.name}
        </li>
      ))}
    </ul>
  )
}
