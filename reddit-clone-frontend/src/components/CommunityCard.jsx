function CommunityCard({ community }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="relative mb-3">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {community.logoImage ? (
            <img
              src={community.logoImage}
              alt={`${community.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <span className="text-xl font-medium text-gray-600">
                {community.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          {community.isPublic ? (
            <Globe className="w-4 h-4 text-blue-500" />
          ) : (
            <Lock className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2">
        r/{community.name}
      </h3>
    </div>
  );
}
