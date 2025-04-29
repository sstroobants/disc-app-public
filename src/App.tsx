import { useState } from 'react'
import './App.css'
import QuadrantPlot from './components/QuadrantPlot'
import SearchBar from './components/SearchBar'
import RoleFilter from './components/RoleFilter'
import { usePersonalityData } from './utils/usePersonalityData'
import { useFilteredData } from './utils/useFilteredData'

function App() {
  const { data, loading, error } = usePersonalityData()
  const [searchTerm, setSearchTerm] = useState('') 
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [isUnionMode, setIsUnionMode] = useState(true) // true = OR, false = AND
  
  const { filteredData, matchingNames, searchMatchCount } = useFilteredData(
    data,
    searchTerm,
    selectedRoles,
    isUnionMode
  )

  if (error) {
    return (
      <div className="App">
        <h1>Communicatiestijlen</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <footer className="copyright-notice">
          © {new Date().getFullYear()} Stein Stroobants. Released under MIT License.
        </footer>
      </div>
    )
  }

  return (
    <div className="App">
      {loading ? (
        <>
        <div className="loading">
          <p>Laden van data...</p>
        </div>
        <footer className="copyright-notice">
          © {new Date().getFullYear()} Stein Stroobants. Released under MIT License.
        </footer>
      </>
      ) : data.length > 0 ? (
        <>
        <div className="layout-container">
          {/* Left side: Plot */}
          <div className="plot-container">
            <QuadrantPlot 
              data={data} 
              searchTerm={searchTerm} 
              selectedRoles={selectedRoles}
              isUnionMode={isUnionMode}
            />
          </div>
          
          {/* Right side: Controls */}
          <div className="controls-container">
            <header className="App-header">
              <h1>Communicatiestijlen</h1>
            </header>
            
            <p className="data-info">
              {filteredData.length === data.length 
                ? `De stijlen van ${data.length} Valsplatters` 
                : `${filteredData.length} van ${data.length} Valsplatters getoond`}
            </p>
            
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              matchingNames={matchingNames} 
            />
            
            {/* Display search results feedback when there's an active search but no matching names are shown */}
            {searchTerm && searchMatchCount === 0 && (
              <div style={{ 
                marginBottom: '15px', 
                color: '#f44336',
                fontWeight: 'bold' 
              }}>
                Geen resultaten gevonden voor "{searchTerm}"
              </div>
            )}
            
            <RoleFilter 
              data={data} 
              selectedRoles={selectedRoles} 
              setSelectedRoles={setSelectedRoles}
              isUnionMode={isUnionMode}
              setIsUnionMode={setIsUnionMode}
            />
          </div>
        </div>
        <footer className="copyright-notice">
          © {new Date().getFullYear()} Stein Stroobants. Released under MIT License.
        </footer>
      </>
      ) : (
        <div className="error">
          <p>Geen geldige data gevonden...</p>
          <footer className="copyright-notice">
            © {new Date().getFullYear()} Stein Stroobants. Released under MIT License.
          </footer>
        </div>
      )}
    </div>
  )
}

export default App
