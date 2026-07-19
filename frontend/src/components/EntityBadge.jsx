export default function EntityBadge({ entity }) {
  return (
    <span className="entity-badge">
      <small>{entity.entity_type.replace('_', ' ')}</small>
      {entity.entity_value}
    </span>
  )
}
