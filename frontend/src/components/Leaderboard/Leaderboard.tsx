import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Award, Users } from 'react-feather';
import Loader from '../common/Loader';

interface LeaderboardEntry {
  id: number;
  student_id: number;
  name: string;
  score: number;
  rank: number;
  avatar?: string;
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('weekly');

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/leaderboard/${period}`);
      if (response.data.success) {
        setEntries(response.data.data);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err: any) {
      console.error('Leaderboard error:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return 'gray';
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="section-title">
          <Trophy size={24} className="icon" /> Bảng xếp hạng
        </h2>
        
        <div className="period-selector">
          <button 
            className={period === 'daily' ? 'active' : ''} 
            onClick={() => setPeriod('daily')}
          >
            Hôm nay
          </button>
          <button 
            className={period === 'weekly' ? 'active' : ''} 
            onClick={() => setPeriod('weekly')}
          >
            Tuần này
          </button>
          <button 
            className={period === 'monthly' ? 'active' : ''} 
            onClick={() => setPeriod('monthly')}
          >
            Tháng này
          </button>
          <button 
            className={period === 'all_time' ? 'active' : ''} 
            onClick={() => setPeriod('all_time')}
          >
            Tất cả
          </button>
        </div>
      </div>

      {loading ? (
        <div className="leaderboard-loading">
          <Loader />
          <p>Đang tải bảng xếp hạng...</p>
        </div>
      ) : error ? (
        <div className="leaderboard-error">
          <p>{error}</p>
        </div>
      ) : (
        <div className="leaderboard-content">
          {entries.length > 0 ? (
            <>
              <div className="top-three">
                {entries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className={`top-entry rank-${entry.rank}`}>
                    <div className="rank-badge" style={{ backgroundColor: getRankColor(entry.rank) }}>
                      {entry.rank}
                    </div>
                    <div className="avatar">
                      {entry.avatar ? (
                        <img src={entry.avatar} alt={entry.name} />
                      ) : (
                        <div className="avatar-placeholder">{entry.name[0]}</div>
                      )}
                    </div>
                    <div className="name">{entry.name}</div>
                    <div className="score">{entry.score} điểm</div>
                  </div>
                ))}
              </div>
              
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Hạng</th>
                    <th>Học viên</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.slice(3).map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.rank}</td>
                      <td>
                        <div className="user-info">
                          {entry.avatar ? (
                            <img src={entry.avatar} alt={entry.name} className="small-avatar" />
                          ) : (
                            <div className="small-avatar-placeholder">{entry.name[0]}</div>
                          )}
                          <span>{entry.name}</span>
                        </div>
                      </td>
                      <td>{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="no-entries">
              <Users size={48} />
              <p>Chưa có dữ liệu xếp hạng cho kỳ này</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;