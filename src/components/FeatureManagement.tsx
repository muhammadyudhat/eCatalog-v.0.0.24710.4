import React from 'react'

type Feature = {
  id: number
  name: string
  description: string
  permissions: {
    admin: boolean
    manager: boolean
    user: boolean
  }
}

type FeatureManagementProps = {
  features: Feature[]
  onUpdateFeature: (feature: Feature) => void
}

const FeatureManagement: React.FC<FeatureManagementProps> = ({
  features,
  onUpdateFeature,
}) => {
  const handlePermissionChange = (
    featureId: number,
    role: 'admin' | 'manager' | 'user',
    value: boolean
  ) => {
    const updatedFeature = features.find((f) => f.id === featureId)
    if (updatedFeature) {
      const newFeature = {
        ...updatedFeature,
        permissions: {
          ...updatedFeature.permissions,
          [role]: value,
        },
      }
      onUpdateFeature(newFeature)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Feature Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Feature</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Admin</th>
              <th className="px-4 py-2 border">Manager</th>
              <th className="px-4 py-2 border">User</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.id}>
                <td className="px-4 py-2 border">{feature.name}</td>
                <td className="px-4 py-2 border">{feature.description}</td>
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={feature.permissions.admin}
                    onChange={(e) =>
                      handlePermissionChange(feature.id, 'admin', e.target.checked)
                    }
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={feature.permissions.manager}
                    onChange={(e) =>
                      handlePermissionChange(feature.id, 'manager', e.target.checked)
                    }
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={feature.permissions.user}
                    onChange={(e) =>
                      handlePermissionChange(feature.id, 'user', e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FeatureManagement